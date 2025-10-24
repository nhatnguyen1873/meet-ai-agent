import { db } from '@/db';
import { agents, meetings } from '@/db/schema';
import { inngest } from '@/inngest/client';
import { streamChat } from '@/lib/stream-chat';
import { streamVideo } from '@/lib/stream-video';
import type { CustomCallCreateData } from '@/modules/meetings/types';
import type {
  CallEndedEvent,
  CallRecordingReadyEvent,
  CallSessionParticipantLeftEvent,
  CallSessionStartedEvent,
  CallTranscriptionReadyEvent,
  MessageNewEvent,
} from '@stream-io/node-sdk';
import { and, eq } from 'drizzle-orm';
import { NextResponse, type NextRequest } from 'next/server';
import { GoogleGenAI, type Content } from '@google/genai';
import { generateAvatarUri } from '@/lib/avatar';
import type { UserResponse } from 'stream-chat';

const googleGenAi = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function verifySignatureWithSDK(body: string, signature: string) {
  return streamVideo.verifyWebhook(body, signature);
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-signature');
  const apiKey = req.headers.get('x-api-key');

  if (!signature || !apiKey) {
    return NextResponse.json(
      { error: 'Missing signature or api key' },
      { status: 401 },
    );
  }

  const body = await req.text();

  if (!verifySignatureWithSDK(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: Record<string, unknown> | undefined;

  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const eventType = payload?.type;

  if (eventType === 'call.session_started') {
    const event = payload as unknown as CallSessionStartedEvent;
    const { meetingId } =
      (event.call.custom as CustomCallCreateData | undefined) ?? {};

    if (!meetingId) {
      return NextResponse.json(
        { error: 'Missing meeting ID' },
        { status: 400 },
      );
    }

    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(and(eq(meetings.id, meetingId), eq(meetings.status, 'upcoming')));

    if (!existingMeeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    await db
      .update(meetings)
      .set({ status: 'active', startedAt: new Date() })
      .where(eq(meetings.id, meetingId));

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingMeeting.agentId));

    if (!existingAgent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    const call = streamVideo.video.call('default', meetingId);
    const openAiApiKey = process.env.OPENAI_API_KEY;

    if (!openAiApiKey) {
      return NextResponse.json(
        { error: 'Missing OpenAI API key' },
        { status: 500 },
      );
    }

    const realtimeClient = await streamVideo.video.connectOpenAi({
      call,
      openAiApiKey,
      agentUserId: existingAgent.id,
    });

    realtimeClient.updateSession({
      instructions: existingAgent.instructions,
    });
  } else if (eventType === 'call.session_participant_left') {
    const event = payload as unknown as CallSessionParticipantLeftEvent;
    const meetingId = event.call_cid.split(':')[1]; // call_cid is formatted as "type:id"

    if (!meetingId) {
      return NextResponse.json(
        { error: 'Missing meeting ID' },
        { status: 400 },
      );
    }

    const call = streamVideo.video.call('default', meetingId);
    await call.end();
  } else if (eventType === 'call.session_ended') {
    const event = payload as unknown as CallEndedEvent;
    const { meetingId } =
      (event.call.custom as CustomCallCreateData | undefined) ?? {};

    if (!meetingId) {
      return NextResponse.json(
        { error: 'Missing meeting ID' },
        { status: 400 },
      );
    }

    await db
      .update(meetings)
      .set({ status: 'processing', endedAt: new Date() })
      .where(and(eq(meetings.id, meetingId), eq(meetings.status, 'active')));
  } else if (eventType === 'call.transcription_ready') {
    const event = payload as unknown as CallTranscriptionReadyEvent;
    const meetingId = event.call_cid.split(':')[1]; // call_cid is formatted as "type:id"

    if (!meetingId) {
      return NextResponse.json(
        { error: 'Missing meeting ID' },
        { status: 400 },
      );
    }

    const [updatedMeeting] = await db
      .update(meetings)
      .set({ transcriptUrl: event.call_transcription.url })
      .where(eq(meetings.id, meetingId))
      .returning();

    if (!updatedMeeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    await inngest.send({
      name: 'meetings/processing',
      data: {
        meetingId: updatedMeeting.id,
        transcriptUrl: updatedMeeting.transcriptUrl,
      },
    });
  } else if (eventType === 'call.recording_ready') {
    const event = payload as unknown as CallRecordingReadyEvent;
    const meetingId = event.call_cid.split(':')[1]; // call_cid is formatted as "type:id"

    await db
      .update(meetings)
      .set({ recordingUrl: event.call_recording.url })
      .where(eq(meetings.id, meetingId));
  } else if (eventType === 'message.new') {
    const event = payload as unknown as MessageNewEvent;

    const channelId = event.channel_id;
    const userId = event.user?.id;
    const text = event.message?.text;

    if (!userId || !text) {
      return NextResponse.json(
        { error: 'Missing user ID or text' },
        { status: 400 },
      );
    }

    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(and(eq(meetings.id, channelId), eq(meetings.status, 'completed')));

    if (!existingMeeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingMeeting.agentId));

    if (!existingAgent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    if (userId !== existingAgent.id) {
      const instructions = `
      You are an AI assistant helping the user revisit a recently completed meeting.
      Below is a summary of the meeting, generated from the transcript:
      
      ${existingMeeting.summary}
      
      The following are your original instructions from the live meeting assistant. Please continue to follow these behavioral guidelines as you assist the user:
      
      ${existingAgent.instructions}
      
      The user may ask questions about the meeting, request clarifications, or ask for follow-up actions.
      Always base your responses on the meeting summary above.
      
      You also have access to the recent conversation history between you and the user. Use the context of previous messages to provide relevant, coherent, and helpful responses. If the user's question refers to something discussed earlier, make sure to take that into account and maintain continuity in the conversation.
      
      If the summary does not contain enough information to answer a question, politely let the user know.
      
      Be concise, helpful, and focus on providing accurate information from the meeting and the ongoing conversation.
      `;

      const channel = streamChat.channel('messaging', channelId);

      await channel.watch();

      const previousMessages = channel.state.messages
        .slice(-5, -1)
        .map<Content>((message) => ({
          role: message.user?.id === existingAgent.id ? 'model' : 'user',
          parts: [{ text: message.text }],
        }));
      const chat = googleGenAi.chats.create({
        model: 'gemini-2.0-flash',
        history: previousMessages,
        config: { systemInstruction: instructions },
      });
      const response = await chat.sendMessage({ message: text });
      const responseText = response.text;

      if (!responseText) {
        return NextResponse.json(
          { error: 'No response from Gemini' },
          { status: 500 },
        );
      }

      const avatar = generateAvatarUri({
        seed: existingAgent.name,
        variant: 'botttsNeutral',
      });

      const user: UserResponse = {
        id: existingAgent.id,
        name: existingAgent.name,
        image: avatar,
      };

      await streamChat.upsertUser(user);

      await channel.sendMessage({
        text: responseText,
        user,
      });
    }
  }

  return NextResponse.json({ status: 'ok' });
}
