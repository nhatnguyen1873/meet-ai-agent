import { Upcoming } from '@/assets/icons/upcoming';
import {
  State,
  StateContent,
  StateDescription,
  StateIcon,
  StateTitle,
} from '@/components/state';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import Link from 'next/link';

interface UpcomingStateProps {
  meetingId: string;
}

export const UpcomingState = ({ meetingId }: UpcomingStateProps) => {
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
      <div className='flex flex-col md:flex-row md:justify-center'>
        <Button asChild>
          <Link href={`/call/${meetingId}`}>
            <Video />
            Start meeting
          </Link>
        </Button>
      </div>
    </div>
  );
};
