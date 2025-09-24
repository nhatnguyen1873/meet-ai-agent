'use client';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';

export const MeetingsView = () => {
  const trpc = useTRPC();
  const getAgents = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

  return (
    <div className='flex flex-col gap-4 px-4 pb-4'>
      {JSON.stringify(getAgents.data, null, 2)}
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

export function MeetingsViewLoading() {
  return (
    <StateContainer>
      <LoadingState
        title='Loading meetings'
        description='This may take a few seconds'
      />
    </StateContainer>
  );
}

export function MeetingsViewError() {
  return (
    <StateContainer>
      <ErrorState
        title='Error loading meetings'
        description='Please try again later'
      />
    </StateContainer>
  );
}
