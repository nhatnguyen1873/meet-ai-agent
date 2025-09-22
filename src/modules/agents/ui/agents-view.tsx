'use client';

import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { columns } from '@/modules/agents/components/columns';
import { DataTable } from '@/modules/agents/components/data-table';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';

export const AgentsView = () => {
  const trpc = useTRPC();
  const getAgents = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  return (
    <div className='px-4 pb-4'>
      {getAgents.data.length ? (
        <DataTable columns={columns} data={getAgents.data} />
      ) : (
        <EmptyState
          title='Create your first agent'
          description='Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call.'
        />
      )}
    </div>
  );
};

function StateContainer(props: { children: ReactNode }) {
  return (
    <div className='flex h-full items-center justify-center'>
      {props.children}
    </div>
  );
}

export function AgentsViewLoading() {
  return (
    <StateContainer>
      <LoadingState
        title='Loading Agents'
        description='This may take a few seconds'
      />
    </StateContainer>
  );
}

export function AgentsViewError() {
  return (
    <StateContainer>
      <ErrorState
        title='Error loading agents'
        description='Please try again later'
      />
    </StateContainer>
  );
}
