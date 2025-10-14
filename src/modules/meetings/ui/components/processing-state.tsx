import { Processing } from '@/assets/icons/processing';
import {
  State,
  StateContent,
  StateDescription,
  StateIcon,
  StateTitle,
} from '@/components/state';

export const ProcessingState = () => {
  return (
    <div className='flex flex-col gap-8 rounded-lg bg-white px-4 py-5'>
      <State>
        <StateIcon asChild>
          <Processing />
        </StateIcon>
        <StateContent>
          <StateTitle>Meeting completed</StateTitle>
          <StateDescription>
            This meeting was completed, a summary will appear soon
          </StateDescription>
        </StateContent>
      </State>
    </div>
  );
};
