import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface AgentDetailsHeaderProps {
  agentId: string;
  agentName: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const AgentDetailsHeader = ({
  agentId,
  agentName,
  onEdit,
  onDelete,
}: AgentDetailsHeaderProps) => {
  return (
    <div className='flex items-center justify-between'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/agents' className='text-xl font-medium'>
                My Agents
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className='text-foreground [&>svg]:size-4' />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href={`/agents/${agentId}`}
                className='text-foreground text-xl font-medium'
              >
                {agentName}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon'>
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          {[
            { key: 'edit', label: 'Edit', onClick: onEdit, icon: Pencil },
            { key: 'delete', label: 'Delete', onClick: onDelete, icon: Trash2 },
          ].map((item) => (
            <DropdownMenuItem key={item.key} onClick={item.onClick}>
              <item.icon className='size-4 text-black' />
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
