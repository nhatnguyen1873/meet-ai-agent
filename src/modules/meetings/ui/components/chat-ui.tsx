'use client';

import { LoadingState } from '@/components/loading-state';
import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { type Channel as StreamChannel } from 'stream-chat';
import {
  Chat,
  useCreateChatClient,
  Channel,
  Window,
  MessageList,
  MessageInput,
  Thread,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';

interface ChatUIProps {
  meetingId: string;
  userId: string;
  userName: string;
  userImage?: string;
}

export const ChatUI = ({
  meetingId,
  userId,
  userName,
  userImage,
}: ChatUIProps) => {
  const trpc = useTRPC();
  const generateChatToken = useMutation(
    trpc.meetings.generateChatToken.mutationOptions(),
  );
  const client = useCreateChatClient({
    apiKey: process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY ?? '',
    tokenOrProvider: generateChatToken.mutateAsync,
    userData: { id: userId, name: userName, image: userImage },
  });
  const [channel, setChannel] = useState<StreamChannel>();

  useEffect(() => {
    let channel: StreamChannel | undefined;

    if (client) {
      channel = client.channel('messaging', meetingId, {
        members: [userId],
      });

      setChannel(channel);
    }
  }, [client, meetingId, userId]);

  if (!client) {
    return (
      <LoadingState
        title='Loading chat'
        description='This may take a few seconds'
      />
    );
  }

  return (
    <div className='overflow-hidden rounded-lg border bg-white'>
      <Chat client={client}>
        <Channel channel={channel}>
          <Window>
            <div className='border-b'>
              <MessageList />
            </div>
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};
