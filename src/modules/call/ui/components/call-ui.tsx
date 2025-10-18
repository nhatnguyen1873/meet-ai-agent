'use client';

import { CallActive } from '@/modules/call/ui/components/call-active';
import { CallEnded } from '@/modules/call/ui/components/call-ended';
import { CallLobby } from '@/modules/call/ui/components/call-lobby';
import { useCall, StreamTheme } from '@stream-io/video-react-sdk';
import { useState, JSX } from 'react';

type Show = 'lobby' | 'call' | 'ended';

interface CallUIProps {
  meetingName: string;
}

export const CallUI = ({ meetingName }: CallUIProps) => {
  const call = useCall();
  const [show, setShow] = useState<Show>('lobby');

  const handleJoin = async () => {
    if (!call) return;
    await call.join();
    setShow('call');
  };

  const handleLeave = async () => {
    if (!call) return;
    call.endCall();
    setShow('ended');
  };

  const renderShowMap: Record<Show, () => JSX.Element> = {
    lobby: () => <CallLobby onJoin={handleJoin} />,
    call: () => <CallActive onLeave={handleLeave} meetingName={meetingName} />,
    ended: () => <CallEnded />,
  };

  return <StreamTheme className='h-full'>{renderShowMap[show]()}</StreamTheme>;
};
