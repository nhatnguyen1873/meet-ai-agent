'use client';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';

export const AgentsView = () => {
  const trpc = useTRPC();
  const getAgents = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  return <div>{JSON.stringify(getAgents.data, null, 2)}</div>;
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
