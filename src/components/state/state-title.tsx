import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

type StateTitleProps = ComponentProps<'h1'>;

export const StateTitle = (props: StateTitleProps) => {
  return (
    <h1 {...props} className={cn('text-lg font-medium', props.className)} />
  );
};
