import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { generateAvatarUri, type AvatarVariant } from '@/lib/avatar';

interface GeneratedAvatarProps {
  seed: string;
  className?: string;
  variant: AvatarVariant;
}

export const GeneratedAvatar = ({
  seed,
  className,
  variant,
}: GeneratedAvatarProps) => {
  const avatar = generateAvatarUri({ seed, variant });

  return (
    <Avatar className={className}>
      <AvatarImage src={avatar} alt={'Avatar'} />
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};
