'use client';

import { authClient } from '@/lib/auth-client';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';

export const HomeView = () => {
  const authSession = authClient.useSession();
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.hello.queryOptions(
      { text: authSession.data?.user?.name || '' },
      { enabled: !!authSession.data?.user },
    ),
  );
  return <div>{data?.greeting}</div>;
};
