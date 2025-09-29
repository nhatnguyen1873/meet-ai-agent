'use client';

import { CommandSelect } from '@/components/command-select';
import { useMeetingsFilters } from '@/modules/meetings/hooks/use-meetings-filters';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export const AgentIdFilter = () => {
  const trpc = useTRPC();
  const [filter, setFilter] = useMeetingsFilters();

  const [agentSearch, setAgentSearch] = useState('');
  const getAgents = useQuery(
    trpc.agents.getMany.queryOptions({
      limit: 100,
      search: agentSearch,
    }),
  );

  return (
    <CommandSelect
      options={getAgents.data?.items.map((agent) => ({
        id: agent.id,
        value: agent.id,
        label: agent.name,
      }))}
      value={filter.agentId ?? ''}
      placeholder='Agent'
      onSearch={setAgentSearch}
      onSelect={(value) => {
        setFilter({
          agentId: value,
        });
      }}
    />
  );
};
