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
      <div className='flex grow flex-col'>
        <DashboardNavbar />
        <main className='grow'>{children}</main>
      </div>
    </SidebarProvider>
  );
}
