import { db } from '@/db';
import { agents, meetings } from '@/db/schema';
import { inngest } from '@/inngest/client';
import { streamVideo } from '@/lib/stream-video';
import type { CustomCallCreateData } from '@/modules/meetings/types';
import type {
  CallEndedEvent,
  CallRecordingReadyEvent,
  CallSessionParticipantLeftEvent,
  CallSessionStartedEvent,
  CallTranscriptionReadyEvent,
} from '@stream-io/node-sdk';
import { and, eq } from 'drizzle-orm';
import { NextResponse, type NextRequest } from 'next/server';

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
  }

  return NextResponse.json({ status: 'ok' });
}
