import { auth } from '@/lib/auth';
import { loadMeetingSearchParams } from '@/modules/meetings/params';
import { MeetingsListHeader } from '@/modules/meetings/ui/components/meetings-list-header';
import {
  MeetingsView,
  MeetingsViewLoading,
} from '@/modules/meetings/ui/views/meetings-view';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

interface MeetingsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function MeetingsPage({
  searchParams,
}: MeetingsPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  const meetingFilters = await loadMeetingSearchParams(searchParams);

  prefetch(trpc.meetings.getMany.queryOptions(meetingFilters));

  return (
    <>
      <MeetingsListHeader />
      <HydrateClient>
        <Suspense fallback={<MeetingsViewLoading />}>
          <MeetingsView />
        </Suspense>
      </HydrateClient>
    </>
  );
}
