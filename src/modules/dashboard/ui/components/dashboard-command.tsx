'use client';

import { GeneratedAvatar } from '@/components/generated-avatar';
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  ResponsiveCommandDialog,
} from '@/components/ui/command';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState, type Dispatch, type SetStateAction } from 'react';

interface DashboardCommandProps {
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: DashboardCommandProps) => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const trpc = useTRPC();
  const getAgents = useQuery(trpc.agents.getMany.queryOptions({ search }));
  const getMeetings = useQuery(trpc.meetings.getMany.queryOptions({ search }));

  return (
    <ResponsiveCommandDialog
      shouldFilter={false}
      open={open}
      onOpenChange={setOpen}
    >
      <CommandInput
        placeholder='Find meetings or agents'
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandGroup heading='Meetings'>
          <CommandEmpty>No meetings found.</CommandEmpty>
          {getMeetings.data?.items.map((meeting) => (
            <CommandItem
              key={meeting.id}
              onSelect={() => {
                router.push(`/meetings/${meeting.id}`);
                setOpen?.(false);
              }}
            >
              {meeting.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator alwaysRender />
        <CommandGroup heading='Agents'>
          <CommandEmpty>No agents found.</CommandEmpty>
          {getAgents.data?.items.map((agent) => (
            <CommandItem
              key={agent.id}
              onSelect={() => {
                router.push(`/agents/${agent.id}`);
                setOpen?.(false);
              }}
            >
              <GeneratedAvatar
                seed={agent.name}
                variant='botttsNeutral'
                className='size-5'
              />
              {agent.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </ResponsiveCommandDialog>
  );
};
