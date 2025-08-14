import { SignUpView } from '@/modules/auth/ui/views/sign-up-view';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function SignUpPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (session) {
    redirect('/');
  }

  return <SignUpView />;
}
