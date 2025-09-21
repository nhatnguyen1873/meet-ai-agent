'use client';

import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { AgentForm } from '@/modules/agents/components/agent-form';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export const AgentListHeader = () => {
  const [isNewAgentDialogOpen, setIsNewAgentDialogOpen] = useState(false);

  return (
    <>
      <ResponsiveDialog
        title='New Agent'
        description='Add a new agent'
        open={isNewAgentDialogOpen}
        onOpenChange={setIsNewAgentDialogOpen}
      >
        <AgentForm
          onSuccess={() => {
            setIsNewAgentDialogOpen(false);
          }}
          onCancel={() => {
            setIsNewAgentDialogOpen(false);
          }}
        />
      </ResponsiveDialog>
      <div className='flex items-center justify-between p-4'>
        <h5 className='text-xl font-medium'>My Agents</h5>
        <Button
          onClick={() => {
            setIsNewAgentDialogOpen(true);
          }}
        >
          <Plus /> Add Agent
        </Button>
      </div>
    </>
  );
};
