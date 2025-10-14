import { Cancelled } from '@/assets/icons/cancelled';
import {
  State,
  StateContent,
  StateDescription,
  StateIcon,
  StateTitle,
} from '@/components/state';

export const CancelledState = () => {
  return (
    <div className='flex flex-col gap-8 rounded-lg bg-white px-4 py-5'>
      <State>
        <StateIcon asChild>
          <Cancelled />
        </StateIcon>
        <StateContent>
          <StateTitle>Meeting cancelled</StateTitle>
          <StateDescription>This meeting was cancelled</StateDescription>
        </StateContent>
      </State>
    </div>
  );
};
