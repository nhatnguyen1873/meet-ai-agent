'use client';

import { ErrorState } from '@/components/error-state';
import { GeneratedAvatar } from '@/components/generated-avatar';
import { LoadingState } from '@/components/loading-state';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Badge } from '@/components/ui/badge';
import { useConfirm } from '@/contexts/confirm/use-confirm';
import { AgentDetailsHeader } from '@/modules/agents/components/agent-details-header';
import { AgentForm } from '@/modules/agents/components/agent-form';
import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { toast } from 'sonner';

interface AgentDetailsViewProps {
  agentId: string;
}

export const AgentDetailsView = ({ agentId }: AgentDetailsViewProps) => {
  const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const getAgentDetails = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId }),
  );
  const { confirm } = useConfirm({
    title: 'Are you sure?',
    description: `This action will delete ${getAgentDetails.data.meetingCount} associated meetings.`,
  });

  const deleteAgent = useMutation(
    trpc.agents.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({}),
        );
        router.push('/agents');
        toast.success('Agent deleted successfully');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  return (
    <>
      <ResponsiveDialog
        title='Edit agent'
        description='Edit agent details'
        open={updateAgentDialogOpen}
        onOpenChange={setUpdateAgentDialogOpen}
      >
        <AgentForm
          initialValues={getAgentDetails.data}
          onSuccess={() => setUpdateAgentDialogOpen(false)}
          onCancel={() => setUpdateAgentDialogOpen(false)}
        />
      </ResponsiveDialog>
      <div className='flex flex-col gap-4 p-4'>
        <AgentDetailsHeader
          agentId={agentId}
          agentName={getAgentDetails.data.name}
          onEdit={() => setUpdateAgentDialogOpen(true)}
          onDelete={async () => {
            const ok = await confirm();
            if (!ok) return;
            deleteAgent.mutate({ id: agentId });
          }}
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
    </>
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
