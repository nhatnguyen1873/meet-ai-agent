import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardNavbar } from '@/modules/dashboard/ui/components/dashboard-navbar';
import { DashboardSidebar } from '@/modules/dashboard/ui/components/dashboard-sidebar';
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider className='bg-muted'>
      <DashboardSidebar />
      <div className='flex min-w-0 grow flex-col'>
        <DashboardNavbar />
        <main className='min-w-0 grow'>{children}</main>
      </div>
    </SidebarProvider>
  );
}
