'use client';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { useConfirm } from '@/contexts/confirm/use-confirm';
import { ActiveState } from '@/modules/meetings/ui/components/active-state';
import { CancelledState } from '@/modules/meetings/ui/components/cancelled-state';
import { CompletedState } from '@/modules/meetings/ui/components/completed-state';
import { EditMeetingDialog } from '@/modules/meetings/ui/components/edit-meeting-dialog';
import { MeetingDetailsHeader } from '@/modules/meetings/ui/components/meeting-details-header';
import { ProcessingState } from '@/modules/meetings/ui/components/processing-state';
import { UpcomingState } from '@/modules/meetings/ui/components/upcoming-state';
import { useTRPC } from '@/trpc/client';
import { MEETING_STATUSES, type MeetingStatus } from '@/types/meeting-status';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { toast } from 'sonner';

interface MeetingDetailsViewProps {
  meetingId: string;
}

export const MeetingDetailsView = ({ meetingId }: MeetingDetailsViewProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [editMeetingOpen, setEditMeetingOpen] = useState(false);

  const { confirm } = useConfirm({
    title: 'Are you sure?',
    description: `This action cannot be undone.`,
  });

  const getMeeting = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId }),
  );

  const deleteMeeting = useMutation(
    trpc.meetings.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );
        router.push('/meetings');
        toast.success('Meeting deleted successfully');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const statusMap: Record<
    MeetingStatus,
    (props: { meetingId: string }) => ReactNode
  > = {
    [MEETING_STATUSES.upcoming]: ({ meetingId }) => (
      <UpcomingState meetingId={meetingId} />
    ),
    [MEETING_STATUSES.active]: ({ meetingId }) => (
      <ActiveState meetingId={meetingId} />
    ),
    [MEETING_STATUSES.cancelled]: () => <CancelledState />,
    [MEETING_STATUSES.processing]: () => <ProcessingState />,
    [MEETING_STATUSES.completed]: () => (
      <CompletedState data={getMeeting.data} />
    ),
  };

  return (
    <>
      <EditMeetingDialog
        open={editMeetingOpen}
        initialData={getMeeting.data}
        onOpenChange={setEditMeetingOpen}
      />
      <div className='flex flex-col'>
        <MeetingDetailsHeader
          meetingId={meetingId}
          meetingName={getMeeting.data.name}
          onEdit={() => {
            setEditMeetingOpen(true);
          }}
          onDelete={async () => {
            const ok = await confirm();
            if (!ok) return;
            deleteMeeting.mutate({ id: meetingId });
          }}
        />
        <div className='px-4 pb-4'>
          {statusMap[getMeeting.data.status]({ meetingId })}
        </div>
      </div>
    </>
  );
};

function StateContainer(props: { children: ReactNode }) {
  return (
    <div className='flex h-full items-center justify-center'>
      {props.children}
    </div>
  );
}

export function MeetingDetailsViewLoading() {
  return (
    <StateContainer>
      <LoadingState
        title='Loading meeting'
        description='This may take a few seconds'
      />
    </StateContainer>
  );
}

export function MeetingDetailsViewError() {
  return (
    <StateContainer>
      <ErrorState
        title='Error loading meeting'
        description='Please try again later'
      />
    </StateContainer>
  );
}
