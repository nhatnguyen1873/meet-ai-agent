import { BreadcrumbHeader } from '@/components/breadcrumb-header';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis, Pencil, Trash2 } from 'lucide-react';

interface MeetingDetailsHeaderProps {
  meetingId: string;
  meetingName: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const MeetingDetailsHeader = ({
  meetingId,
  meetingName,
  onEdit,
  onDelete,
}: MeetingDetailsHeaderProps) => {
  return (
    <div className='flex items-center justify-between p-4'>
      <BreadcrumbHeader
        items={[
          {
            id: 'meetings',
            label: 'My meetings',
            href: '/meetings',
          },
          {
            id: 'meeting-details',
            label: meetingName,
            href: `/meetings/${meetingId}`,
          },
        ]}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon'>
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          {[
            { id: 'edit', label: 'Edit', onClick: onEdit, icon: Pencil },
            { id: 'delete', label: 'Delete', onClick: onDelete, icon: Trash2 },
          ].map((item) => (
            <DropdownMenuItem key={item.id} onClick={item.onClick}>
              <item.icon className='size-4 text-black' />
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
