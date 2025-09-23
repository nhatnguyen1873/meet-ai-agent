import { auth } from '@/lib/auth';
import {
  AgentDetailsView,
  AgentDetailsViewLoading,
} from '@/modules/agents/ui/agent-details-view';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

interface AgentDetailsPageProps {
  params: Promise<{
    agentId: string;
  }>;
}

export default async function AgentDetailsPage({
  params,
}: AgentDetailsPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  const agentId = (await params).agentId;
  prefetch(trpc.agents.getOne.queryOptions({ id: agentId }));

  return (
    <HydrateClient>
      <Suspense fallback={<AgentDetailsViewLoading />}>
        <AgentDetailsView agentId={agentId} />
      </Suspense>
    </HydrateClient>
  );
}
