'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { DEFAULT_PAGE } from '@/constants';
import { useMeetingsFilters } from '@/modules/meetings/hooks/use-meetings-filters';
import { AgentIdFilter } from '@/modules/meetings/ui/components/agent-id-filter';
import { NewMeetingDialog } from '@/modules/meetings/ui/components/new-meeting-dialog';
import { StatusFilter } from '@/modules/meetings/ui/components/status-filter';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

export const MeetingsListHeader = () => {
  const [newMeetingDialogOpen, setNewMeetingDialogOpen] = useState(false);
  const [filters, setFilters] = useMeetingsFilters();

  const isAnyFilterModified =
    !!filters.search || !!filters.status || !!filters.agentId;

  return (
    <>
      <NewMeetingDialog
        open={newMeetingDialogOpen}
        onOpenChange={setNewMeetingDialogOpen}
      />
      <div className='flex flex-col gap-3 p-4'>
        <div className='flex items-center justify-between'>
          <h5 className='text-xl font-medium'>My meetings</h5>
          <Button
            onClick={() => {
              setNewMeetingDialogOpen(true);
            }}
          >
            <Plus />
            Add meeting
          </Button>
        </div>
        <ScrollArea>
          <div className='flex items-center gap-x-2'>
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
            <StatusFilter />
            <AgentIdFilter />
            {isAnyFilterModified && (
              <Button
                variant='outline'
                onClick={() => {
                  setFilters({
                    search: '',
                    agentId: '',
                    page: DEFAULT_PAGE,
                    status: null,
                  });
                }}
              >
                <X className='size-4' />
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
