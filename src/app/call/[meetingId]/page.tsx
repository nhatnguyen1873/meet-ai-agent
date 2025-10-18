import { auth } from '@/lib/auth';
import { CallView } from '@/modules/call/ui/views/call-view';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

interface CallPageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

export default async function CallPage({ params }: CallPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  const { meetingId } = await params;

  prefetch(trpc.meetings.getOne.queryOptions({ id: meetingId }));

  return (
    <HydrateClient>
      <CallView meetingId={meetingId} />
    </HydrateClient>
  );
}
