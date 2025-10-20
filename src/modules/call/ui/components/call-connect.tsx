'use client';

import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  StreamVideoClient,
  Call,
  CallingState,
  StreamVideo,
  StreamCall,
} from '@stream-io/video-react-sdk';
import { Loader } from 'lucide-react';
import { CallUI } from '@/modules/call/ui/components/call-ui';

import '@stream-io/video-react-sdk/dist/css/styles.css';

interface CallConnectProps {
  meetingId: string;
  meetingName: string;
  userId: string;
  userName: string;
  userAvatar: string;
}

export const CallConnect = ({
  meetingId,
  meetingName,
  userId,
  userName,
  userAvatar,
}: CallConnectProps) => {
  const [client, setClient] = useState<StreamVideoClient>();
  const [call, setCall] = useState<Call>();
  const trpc = useTRPC();
  const generateToken = useMutation(
    trpc.meetings.generateToken.mutationOptions(),
  );

  useEffect(() => {
    const streamApiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    let _client: StreamVideoClient | undefined;

    if (streamApiKey) {
      _client = new StreamVideoClient({
        apiKey: streamApiKey,
        user: {
          id: userId,
          name: userName,
          image: userAvatar,
        },
        tokenProvider: generateToken.mutateAsync,
      });
      setClient(_client);
    }

    return () => {
      _client?.disconnectUser();
      setClient(undefined);
    };
  }, [generateToken.mutateAsync, userAvatar, userId, userName]);

  useEffect(() => {
    let _call: Call | undefined;

    if (client) {
      _call = client.call('default', meetingId);
      _call.camera.disable();
      _call.microphone.disable();
      setCall(_call);
    }

    return () => {
      if (_call?.state.callingState !== CallingState.LEFT) {
        _call?.leave();
        _call?.endCall();
      }
      setCall(undefined);
    };
  }, [client, meetingId]);

  if (!client || !call) {
    return (
      <div className='flex h-screen items-center justify-center bg-radial from-slate-700 to-slate-950'>
        <Loader className='size-6 animate-spin text-white' />
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUI meetingName={meetingName} />
      </StreamCall>
    </StreamVideo>
  );
};
