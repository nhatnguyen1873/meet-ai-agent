'use client';

import { ErrorState } from '@/components/error-state';
import { authClient } from '@/lib/auth-client';
import { generateAvatarUri } from '@/lib/avatar';
import { CallConnect } from '@/modules/call/ui/components/call-connect';
import { Loader } from 'lucide-react';

interface CallProviderProps {
  meetingId: string;
  meetingName: string;
}

export const CallProvider = ({ meetingId, meetingName }: CallProviderProps) => {
  const session = authClient.useSession();

  if (!session.data && session.isPending) {
    return (
      <div className='flex h-screen items-center justify-center bg-radial from-slate-700 to-slate-950'>
        <Loader className='size-6 animate-spin text-white' />
      </div>
    );
  }

  if (!session.data) {
    return (
      <div className='flex h-screen items-center justify-center bg-radial from-slate-700 to-slate-950'>
        <ErrorState
          title='You are not logged in'
          description='Please log in to join the meeting'
        />
      </div>
    );
  }

  const user = session.data?.user;

  return (
    <CallConnect
      meetingId={meetingId}
      meetingName={meetingName}
      userId={user.id}
      userName={user.name}
      userAvatar={
        user.image ??
        generateAvatarUri({ seed: user.name, variant: 'initials' })
      }
    />
  );
};
