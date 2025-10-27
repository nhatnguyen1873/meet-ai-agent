import { auth } from '@/lib/auth';
import {
  UpgradeView,
  UpgradeViewLoading,
} from '@/modules/premium/ui/views/upgrade-view';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function UpgradePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  prefetch(trpc.premium.getCurrentSubscription.queryOptions());
  prefetch(trpc.premium.getProducts.queryOptions());

  return (
    <HydrateClient>
      <Suspense fallback={<UpgradeViewLoading />}>
        <UpgradeView />
      </Suspense>
    </HydrateClient>
  );
}
