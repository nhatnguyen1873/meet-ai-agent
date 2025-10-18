import type { ReactNode } from 'react';

interface CallLayoutProps {
  children: ReactNode;
}

export default function CallLayout({ children }: CallLayoutProps) {
  return <div className='h-screen bg-black'>{children}</div>;
}
