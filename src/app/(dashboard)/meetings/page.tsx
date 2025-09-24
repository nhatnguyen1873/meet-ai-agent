import { auth } from '@/lib/auth';
import {
  MeetingsView,
  MeetingsViewLoading,
} from '@/modules/meetings/ui/views/meetings-view';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function MeetingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  prefetch(trpc.meetings.getMany.queryOptions({}));

  return (
    <HydrateClient>
      <Suspense fallback={<MeetingsViewLoading />}>
        <MeetingsView />
      </Suspense>
    </HydrateClient>
  );
}
