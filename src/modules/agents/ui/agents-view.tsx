'use client';

import { DataPagination } from '@/components/data-pagination';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { columns } from '@/modules/agents/components/columns';
import { DataTable } from '@/components/data-table';
import { useAgentsFilters } from '@/modules/agents/hooks/use-agents-filters';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

export const AgentsView = () => {
  const router = useRouter();
  const [filters, setFilters] = useAgentsFilters();
  const trpc = useTRPC();
  const getAgents = useSuspenseQuery(trpc.agents.getMany.queryOptions(filters));

  return (
    <div className='flex flex-col gap-4 px-4 pb-4'>
      {getAgents.data?.total ? (
        <>
          <DataTable
            columns={columns}
            data={getAgents.data.items}
            onRowClick={(row) => {
              router.push(`/agents/${row.id}`);
            }}
          />
          <DataPagination
            totalPages={getAgents.data.totalPages}
            page={filters.page}
            onPageChange={(page) => {
              setFilters({ page });
            }}
          />
        </>
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
