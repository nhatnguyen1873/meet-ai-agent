import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

type StateContentProps = ComponentProps<'div'>;

export const StateContent = (props: StateContentProps) => {
  return (
    <div
      {...props}
      className={cn(
        'flex max-w-md flex-col gap-y-6 text-center',
        props.className,
      )}
    />
  );
};
