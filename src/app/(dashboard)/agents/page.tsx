import { AgentListHeader } from '@/modules/agents/components/agent-list-header';
import { AgentsViewLoading, AgentsView } from '@/modules/agents/ui/agents-view';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import { Suspense } from 'react';

export default function AgentsPage() {
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
