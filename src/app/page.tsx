import { auth } from '@/lib/auth';
import { HomeView } from '@/modules/home/ui/views/home-view';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    redirect('/sign-in');
  }

  return <HomeView />;
}
