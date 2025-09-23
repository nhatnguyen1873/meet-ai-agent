'use client';

import { ErrorState } from '@/components/error-state';
import { GeneratedAvatar } from '@/components/generated-avatar';
import { LoadingState } from '@/components/loading-state';
import { Badge } from '@/components/ui/badge';
import { AgentDetailsHeader } from '@/modules/agents/components/agent-details-header';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Video } from 'lucide-react';
import type { ReactNode } from 'react';

interface AgentDetailsViewProps {
  agentId: string;
}

export const AgentDetailsView = ({ agentId }: AgentDetailsViewProps) => {
  const trpc = useTRPC();
  const getAgentDetails = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId }),
  );

  return (
    <div className='flex flex-col gap-4 p-4'>
      <AgentDetailsHeader
        agentId={agentId}
        agentName={getAgentDetails.data.name}
        onEdit={() => {}}
        onDelete={() => {}}
      />
      <div className='rounded-lg border bg-white'>
        <div className='flex flex-col gap-5 px-4 py-5'>
          <div className='flex items-center gap-3'>
            <GeneratedAvatar
              seed={getAgentDetails.data.name}
              variant='botttsNeutral'
              className='size-10'
            />
            <h2 className='text-2xl font-medium'>
              {getAgentDetails.data.name}
            </h2>
          </div>
          <Badge variant='outline'>
            <Video className='size-4 text-blue-700' />
            {getAgentDetails.data.meetingCount} meeting
            {getAgentDetails.data.meetingCount <= 1 ? '' : 's'}
          </Badge>
          <div className='flex flex-col gap-4'>
            <p className='text-lg font-medium'>Instructions</p>
            <p className='text-neutral-800'>
              {getAgentDetails.data.instructions}
            </p>
          </div>
        </div>
      </div>
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

export function AgentDetailsViewLoading() {
  return (
    <StateContainer>
      <LoadingState
        title='Loading agent'
        description='This may take a few seconds'
      />
    </StateContainer>
  );
}

export function AgentDetailsViewError() {
  return (
    <StateContainer>
      <ErrorState
        title='Error loading agent'
        description='Please try again later'
      />
    </StateContainer>
  );
}
