'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  MAX_FREE_AGENTS,
  MAX_FREE_MEETINGS,
} from '@/modules/premium/constants';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { Rocket } from 'lucide-react';
import Link from 'next/link';

export const DashboardTrial = () => {
  const trpc = useTRPC();
  const getFreeUsage = useQuery(trpc.premium.getFreeUsage.queryOptions());

  if (!getFreeUsage.data) {
    return null;
  }

  return (
    <div className='border-border/10 flex w-full flex-col gap-y-2 rounded-lg border bg-white/5'>
      <div className='flex flex-col gap-y-4 p-3'>
        <div className='flex items-center gap-2'>
          <Rocket className='size-4' />
          <p className='text-sm font-medium'>Free trial</p>
        </div>
        <div className='flex flex-col gap-y-2'>
          <p className='text-xs'>
            {getFreeUsage.data.agentCount}/{MAX_FREE_AGENTS} agents
          </p>
          <Progress
            value={(getFreeUsage.data.agentCount / MAX_FREE_AGENTS) * 100}
          />
        </div>
        <div className='flex flex-col gap-y-2'>
          <p className='text-xs'>
            {getFreeUsage.data.meetingCount}/{MAX_FREE_MEETINGS} meetings
          </p>
          <Progress
            value={(getFreeUsage.data.meetingCount / MAX_FREE_MEETINGS) * 100}
          />
        </div>
      </div>
      <Button
        asChild
        className='border-border/10 hover:bg-primary/10 rounded-t-none border-t bg-transparent text-black'
      >
        <Link href='/upgrade'>Upgrade</Link>
      </Button>
    </div>
  );
};
