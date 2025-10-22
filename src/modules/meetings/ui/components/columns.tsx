import { GeneratedAvatar } from '@/components/generated-avatar';
import type { MeetingGetMany } from '@/modules/meetings/types';
import type { MeetingStatus } from '@/types/meeting-status';
import { ColumnDef } from '@tanstack/react-table';
import {
  CircleCheck,
  CircleX,
  ClockArrowUp,
  ClockFading,
  CornerDownRight,
  Loader,
  type LucideIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn, formatDuration } from '@/lib/utils';

const statusIconMap: Record<MeetingStatus, LucideIcon> = {
  upcoming: ClockArrowUp,
  active: Loader,
  completed: CircleCheck,
  processing: Loader,
  cancelled: CircleX,
};

const statusMapClassNames: Record<MeetingStatus, string> = {
  upcoming: 'bg-yellow-500/20 text-yellow-800 border-yellow-800/5',
  active: 'bg-blue-500/20 text-blue-800 border-blue-800/5',
  completed: 'bg-emerald-500/20 text-emerald-800 border-emerald-800/5',
  cancelled: 'bg-rose-500/20 text-rose-800 border-rose-800/5',
  processing: 'bg-gray-300/20 text-gray-800 border-gray-800/5',
};

export const columns: ColumnDef<MeetingGetMany['items'][number]>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className='flex flex-col gap-1'>
        <p className='font-semibold capitalize'>{row.original.name}</p>
        <div className='flex items-center gap-x-2'>
          <div className='flex items-center gap-x-1'>
            <CornerDownRight className='text-muted-foreground size-3' />
            <p className='text-muted-foreground max-w-[200px] truncate text-sm capitalize'>
              {row.original.agent.name}
            </p>
          </div>
          <GeneratedAvatar
            seed={row.original.agent.name}
            variant='botttsNeutral'
            className='size-4'
          />
          {row.original.startedAt ? (
            <p className='text-muted-foreground text-sm'>
              {format(row.original.startedAt, 'MMM d')}
            </p>
          ) : null}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const Icon = statusIconMap[row.original.status];
      return (
        <Badge
          variant='outline'
          className={cn(
            'text-muted-foreground capitalize',
            statusMapClassNames[row.original.status],
          )}
        >
          <Icon
            className={cn(
              'size-4',
              row.original.status === 'processing' && 'animate-spin',
            )}
          />
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: ({ row }) => (
      <Badge variant='outline' className='capitalize'>
        <ClockFading className='size-4 text-blue-700' />
        {row.original.duration
          ? formatDuration(row.original.duration)
          : 'No duration'}
      </Badge>
    ),
  },
];
