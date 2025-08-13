import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { ComponentProps } from 'react';

type ContainerFooterLinkProps = ComponentProps<typeof Link>;

export const ContainerFooterLink = (props: ContainerFooterLinkProps) => {
  return (
    <Link
      {...props}
      className={cn('text-black hover:underline', props.className)}
    />
  );
};
