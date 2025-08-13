import { cn } from '@/lib/utils';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type ContainerWrapRef = HTMLDivElement;

type ContainerWrapProps = DetailedHTMLProps<
  HTMLAttributes<ContainerWrapRef>,
  ContainerWrapRef
>;

export const ContainerWrap = (props: ContainerWrapProps) => {
  return (
    <div
      {...props}
      className={cn('flex max-w-sm grow flex-col gap-6', props.className)}
    />
  );
};
