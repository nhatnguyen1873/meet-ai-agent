import { auth } from '@/lib/auth';
import { AgentListHeader } from '@/modules/agents/components/agent-list-header';
import { AgentsViewLoading, AgentsView } from '@/modules/agents/ui/agents-view';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function AgentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  prefetch(trpc.agents.getMany.queryOptions());

  return (
    <>
      <AgentListHeader />
      <HydrateClient>
        <Suspense fallback={<AgentsViewLoading />}>
          <AgentsView />
        </Suspense>
      </HydrateClient>
    </>
  );
}
