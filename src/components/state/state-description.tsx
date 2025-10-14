import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

type StateDescriptionProps = ComponentProps<'p'>;

export const StateDescription = (props: StateDescriptionProps) => {
  return (
    <p
      {...props}
      className={cn('text-muted-foreground text-sm', props.className)}
    />
  );
};
