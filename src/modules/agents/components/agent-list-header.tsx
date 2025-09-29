'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { DEFAULT_PAGE } from '@/constants';
import { NewAgentDialog } from '@/modules/agents/components/new-agent-dialog';
import { useAgentsFilters } from '@/modules/agents/hooks/use-agents-filters';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

export const AgentListHeader = () => {
  const [filters, setFilters] = useAgentsFilters();
  const [isNewAgentDialogOpen, setIsNewAgentDialogOpen] = useState(false);

  return (
    <>
      <NewAgentDialog
        open={isNewAgentDialogOpen}
        onOpenChange={setIsNewAgentDialogOpen}
      />
      <div className='flex flex-col gap-3 p-4'>
        <div className='flex items-center justify-between'>
          <h5 className='text-xl font-medium'>My Agents</h5>
          <Button
            onClick={() => {
              setIsNewAgentDialogOpen(true);
            }}
          >
            <Plus /> Add Agent
          </Button>
        </div>
        <ScrollArea>
          <div className='flex items-center gap-2'>
            <Input
              placeholder='Search by name'
              value={filters.search}
              onChange={(e) => {
                setFilters({
                  search: e.target.value,
                });
              }}
              className='w-[240px] bg-white'
            />
            {!!filters.search && (
              <Button
                variant='outline'
                onClick={() => {
                  setFilters({
                    search: '',
                    page: DEFAULT_PAGE,
                  });
                }}
              >
                <X />
                Clear
              </Button>
            )}
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </div>
    </>
  );
};
