import { cn } from '@/lib/utils';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type ContainerHeaderDescriptionRef = HTMLParagraphElement;

type ContainerHeaderDescriptionProps = DetailedHTMLProps<
  HTMLAttributes<ContainerHeaderDescriptionRef>,
  ContainerHeaderDescriptionRef
>;

export const ContainerHeaderDescription = (
  props: ContainerHeaderDescriptionProps,
) => {
  return (
    <p
      {...props}
      className={cn(
        'text-muted-foreground text-center text-balance',
        props.className,
      )}
    />
  );
};
