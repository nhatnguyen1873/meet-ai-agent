import { GeneratedAvatar } from '@/components/generated-avatar';
import { Badge } from '@/components/ui/badge';
import type { AgentGetMany } from '@/modules/agents/types';
import { ColumnDef } from '@tanstack/react-table';
import { Video } from 'lucide-react';

export const columns: ColumnDef<AgentGetMany[number]>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className='flex flex-col gap-1'>
        <div className='flex items-center gap-2'>
          <GeneratedAvatar seed={row.original.name} variant='botttsNeutral' />
          <p>{row.original.name}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'meetingCount',
    header: 'Meetings',
    cell: () => (
      <Badge variant={'outline'} className='gap-x-2'>
        <Video className='size-4 text-blue-700' />5 meetings
      </Badge>
    ),
  },
];
