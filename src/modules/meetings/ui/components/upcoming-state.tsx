import { Upcoming } from '@/assets/icons/upcoming';
import {
  State,
  StateContent,
  StateDescription,
  StateIcon,
  StateTitle,
} from '@/components/state';
import { Button } from '@/components/ui/button';
import { Ban, Video } from 'lucide-react';
import Link from 'next/link';

interface UpcomingStateProps {
  meetingId?: string;
  isCancelling?: boolean;
  onCancel?: () => void;
}

export const UpcomingState = ({
  meetingId,
  isCancelling,
  onCancel,
}: UpcomingStateProps) => {
  return (
    <div className='flex flex-col gap-8 rounded-lg bg-white px-4 py-5'>
      <State>
        <StateIcon asChild>
          <Upcoming />
        </StateIcon>
        <StateContent>
          <StateTitle>Not started yet</StateTitle>
          <StateDescription>
            Once you start this meeting, a summary will appear here
          </StateDescription>
        </StateContent>
      </State>
      <div className='flex flex-col-reverse gap-2 md:flex-row md:justify-center'>
        <Button
          variant={'secondary'}
          disabled={isCancelling}
          onClick={onCancel}
        >
          <Ban />
          Cancel meeting
        </Button>
        <Button disabled={isCancelling} asChild>
          <Link href={`/call/${meetingId}`}>
            <Video />
            Start meeting
          </Link>
        </Button>
      </div>
    </div>
  );
};
