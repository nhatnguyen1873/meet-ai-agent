import { SignInView } from '@/modules/auth/ui/views/sign-in-view';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function SignInPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (session) {
    redirect('/');
  }

  return <SignInView />;
}
