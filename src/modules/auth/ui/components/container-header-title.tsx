import { cn } from '@/lib/utils';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type ContainerHeaderTitleRef = HTMLHeadingElement;

type ContainerHeaderTitleProps = DetailedHTMLProps<
  HTMLAttributes<ContainerHeaderTitleRef>,
  ContainerHeaderTitleRef
>;

export const ContainerHeaderTitle = (props: ContainerHeaderTitleProps) => {
  return (
    <h1
      {...props}
      className={cn('text-center text-2xl font-bold', props.className)}
    />
  );
};
