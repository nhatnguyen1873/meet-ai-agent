import { cn } from '@/lib/utils';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type ContainerRef = HTMLDivElement;

type ContainerProps = DetailedHTMLProps<
  HTMLAttributes<ContainerRef>,
  ContainerRef
>;

export const Container = (props: ContainerProps) => {
  return (
    <div
      {...props}
      className={cn('flex h-full items-center justify-center', props.className)}
    />
  );
};
