import { cn } from '@/lib/utils';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type ContainerProvidersRef = HTMLDivElement;

type ContainerProvidersProps = DetailedHTMLProps<
  HTMLAttributes<ContainerProvidersRef>,
  ContainerProvidersRef
>;

export const ContainerProviders = (props: ContainerProvidersProps) => {
  return (
    <div {...props} className={cn('grid grid-cols-2 gap-4', props.className)} />
  );
};
