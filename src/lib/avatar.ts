import { botttsNeutral, initials } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';

export type AvatarVariant = 'botttsNeutral' | 'initials';

export const generateAvatarUri = ({
  seed,
  variant,
}: {
  seed: string;
  variant: AvatarVariant;
}) => {
  let avatar;

  if (variant === 'initials') {
    avatar = createAvatar(initials, {
      seed,
      fontWeight: 500,
      fontSize: 42,
    });
  } else {
    avatar = createAvatar(botttsNeutral, {
      seed,
    });
  }

  return avatar.toDataUri();
};
