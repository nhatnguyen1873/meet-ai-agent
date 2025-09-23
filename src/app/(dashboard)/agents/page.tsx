import { auth } from '@/lib/auth';
import { AgentListHeader } from '@/modules/agents/components/agent-list-header';
import { loadSearchParams } from '@/modules/agents/params';
import { AgentsViewLoading, AgentsView } from '@/modules/agents/ui/agents-view';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

interface AgentsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AgentsPage({ searchParams }: AgentsPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  const filters = await loadSearchParams(searchParams);
  prefetch(trpc.agents.getMany.queryOptions(filters));

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
