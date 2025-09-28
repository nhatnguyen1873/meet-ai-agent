'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NewMeetingDialog } from '@/modules/meetings/ui/components/new-meeting-dialog';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export const MeetingsListHeader = () => {
  const [newMeetingDialogOpen, setNewMeetingDialogOpen] = useState(false);

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
        <div className='flex items-center gap-2'>
          <Input placeholder='Search by name' className='w-[240px] bg-white' />
        </div>
      </div>
    </>
  );
};
