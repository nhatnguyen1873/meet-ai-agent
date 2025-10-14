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

interface ActiveStateProps {
  meetingId?: string;
}

export const ActiveState = ({ meetingId }: ActiveStateProps) => {
  return (
    <div className='flex flex-col gap-8 rounded-lg bg-white px-4 py-5'>
      <State>
        <StateIcon asChild>
          <Upcoming />
        </StateIcon>
        <StateContent>
          <StateTitle>Meeting is active</StateTitle>
          <StateDescription>
            Meeting will end once all participants leave
          </StateDescription>
        </StateContent>
      </State>
      <div className='flex flex-col md:flex-row md:justify-center'>
        <Button asChild>
          <Link href={`/call/${meetingId}`}>
            <Video />
            Join meeting
          </Link>
        </Button>
      </div>
    </div>
  );
};
