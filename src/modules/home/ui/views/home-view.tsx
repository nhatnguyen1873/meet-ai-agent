'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { type DetailedHTMLProps, type HTMLAttributes } from 'react';

export const HomeView = () => {
  const router = useRouter();
  const authSession = authClient.useSession();

  if (authSession.data?.user) {
    return (
      <Container className='flex flex-col gap-4'>
        <p>Logged in as {authSession.data.user.email}</p>
        <Button
          onClick={() => {
            authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push('/sign-in');
                },
              },
            });
          }}
        >
          Sign out
        </Button>
      </Container>
    );
  }

  return <Container>Loading...</Container>;
};

function Container(
  props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) {
  return <div {...props} className={cn('p-6', props.className)} />;
}
