import { Empty } from '@/assets/icons/empty';
import { cn } from '@/lib/utils';
import { Slot, SlotProps } from '@radix-ui/react-slot';
import type { ComponentProps } from 'react';

type StateIconProps =
  | (ComponentProps<'svg'> & { asChild?: false })
  | (SlotProps & { asChild: true });

export const StateIcon = (props: StateIconProps) => {
  const sharedClassName = cn('size-[240px]', props.className);

  if (props.asChild) {
    // TODO: improve below
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { asChild, ...rest } = props;
    return <Slot {...rest} className={sharedClassName} />;
  }

  return <Empty {...props} className={sharedClassName} />;
};
