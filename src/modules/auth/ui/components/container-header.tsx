import { cn } from '@/lib/utils';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type ContainerHeaderRef = HTMLDivElement;

type ContainerHeaderProps = DetailedHTMLProps<
  HTMLAttributes<ContainerHeaderRef>,
  ContainerHeaderRef
>;

export const ContainerHeader = (props: ContainerHeaderProps) => {
  return <div {...props} className={cn('flex flex-col', props.className)} />;
};
