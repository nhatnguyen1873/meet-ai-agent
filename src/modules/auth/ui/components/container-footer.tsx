import { cn } from '@/lib/utils';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type ContainerFooterRef = HTMLParagraphElement;

type ContainerFooterProps = DetailedHTMLProps<
  HTMLAttributes<ContainerFooterRef>,
  ContainerFooterRef
>;

export const ContainerFooter = (props: ContainerFooterProps) => {
  return (
    <p {...props} className={cn('text-center text-sm', props.className)} />
  );
};
