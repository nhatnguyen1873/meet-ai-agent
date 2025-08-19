import { LogoLight } from '@/assets/icons/logo-light';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='bg-muted grid h-svh md:grid-cols-2'>
      <div className='flex flex-col overflow-y-auto'>
        <div className='p-5'>
          <Link href={'/'}>
            <LogoLight className='w-10' />
          </Link>
        </div>
        <div className='grow p-5'>{children}</div>
        <p className='text-muted-foreground p-5 text-center text-xs *:[a]:text-black *:[a]:underline *:[a]:underline-offset-4'>
          By continuing, you agree to our{' '}
          <Link href={'#'}>Terms of Service</Link> and{' '}
          <Link href={'#'}>Privacy Policy</Link>.
        </p>
      </div>
      <div className='hidden items-center justify-center bg-slate-950 md:flex'>
        <LogoLight className='size-60' />
      </div>
    </div>
  );
}
