import { AgentsViewLoading, AgentsView } from '@/modules/agents/ui/agents-view';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import { Suspense } from 'react';

export default function AgentsPage() {
  prefetch(trpc.agents.getMany.queryOptions());

  return (
    <HydrateClient>
      <Suspense fallback={<AgentsViewLoading />}>
        <AgentsView />
      </Suspense>
    </HydrateClient>
  );
}
