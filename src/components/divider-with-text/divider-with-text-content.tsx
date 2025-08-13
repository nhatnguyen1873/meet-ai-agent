import { cn } from '@/lib/utils';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type DividerWithTextContentRef = HTMLDivElement;

type DividerWithTextContentProps = DetailedHTMLProps<
  HTMLAttributes<DividerWithTextContentRef>,
  DividerWithTextContentRef
>;

export const DividerWithTextContent = (props: DividerWithTextContentProps) => {
  return (
    <div
      {...props}
      className={cn(
        'text-muted-foreground bg-muted relative z-10 px-2 text-center',
        props.className,
      )}
    />
  );
};
