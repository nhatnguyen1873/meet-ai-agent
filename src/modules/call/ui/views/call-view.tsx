'use client';

import { ErrorState } from '@/components/error-state';
import { CallProvider } from '@/modules/call/ui/components/call-provider';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

interface CallViewProps {
  meetingId: string;
}

export const CallView = ({ meetingId }: CallViewProps) => {
  const trpc = useTRPC();
  const getOneMeeting = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId }),
  );

  if (getOneMeeting.data.status === 'completed') {
    return (
      <div className='flex h-screen items-center justify-center'>
        <ErrorState
          title='Meeting has ended'
          description='You can no longer join this meeting'
        />
      </div>
    );
  }

  return (
    <CallProvider meetingId={meetingId} meetingName={getOneMeeting.data.name} />
  );
};
