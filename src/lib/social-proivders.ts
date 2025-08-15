import { Github } from '@/assets/icons/github';
import { Google } from '@/assets/icons/google';
import type { SocialProvider } from 'better-auth/social-providers';
import type { FC, Key, SVGProps } from 'react';

export const socialProviders: {
  id: Key;
  label: string;
  provider: SocialProvider;
  icon: FC<SVGProps<SVGSVGElement>>;
}[] = [
  {
    id: 'google',
    label: 'Google',
    provider: 'google',
    icon: Google,
  },
  {
    id: 'github',
    label: 'Github',
    provider: 'github',
    icon: Github,
  },
];
