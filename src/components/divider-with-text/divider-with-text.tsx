import { cn } from '@/lib/utils';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type DividerWithTextRef = HTMLDivElement;

type DividerWithTextProps = DetailedHTMLProps<
  HTMLAttributes<DividerWithTextRef>,
  DividerWithTextRef
>;

export const DividerWithText = (props: DividerWithTextProps) => {
  return (
    <div
      {...props}
      className={cn(
        'after:border-border relative flex justify-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:border-t',
        props.className,
      )}
    />
  );
};
