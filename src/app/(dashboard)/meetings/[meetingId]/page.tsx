import { auth } from '@/lib/auth';
import {
  MeetingDetailsView,
  MeetingDetailsViewLoading,
} from '@/modules/meetings/ui/views/meeting-details-view';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

interface MeetingDetailsPageProps {
  params: Promise<{ meetingId: string }>;
}

export default async function MeetingDetailsPage({
  params,
}: MeetingDetailsPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  const meetingId = (await params).meetingId;

  prefetch(trpc.meetings.getOne.queryOptions({ id: meetingId }));

  return (
    <HydrateClient>
      <Suspense fallback={<MeetingDetailsViewLoading />}>
        <MeetingDetailsView meetingId={meetingId} />
      </Suspense>
    </HydrateClient>
  );
}
