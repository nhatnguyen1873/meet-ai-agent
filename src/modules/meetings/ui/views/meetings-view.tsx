'use client';

import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { DataTable } from '@/components/data-table';
import { columns } from '@/modules/meetings/ui/components/columns';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';

export const MeetingsView = () => {
  const trpc = useTRPC();
  const getMeetings = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

  return (
    <div className='flex flex-col gap-4 px-4 pb-4'>
      {getMeetings.data.items.length > 0 ? (
        <DataTable columns={columns} data={getMeetings.data.items} />
      ) : (
        <EmptyState
          title='Create your first meeting'
          description='Schedule a meeting to connect with others. Each meeting lets you collaborate, share ideas, and interact with participants in real time.'
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
