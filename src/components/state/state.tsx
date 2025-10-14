import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

type StateProps = ComponentProps<'div'>;

export const State = (props: StateProps) => {
  return (
    <div
      {...props}
      className={cn(
        'flex flex-col items-center justify-between',
        props.className,
      )}
    />
  );
};
