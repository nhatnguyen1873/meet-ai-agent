'use client';

import { LogoLight } from '@/assets/icons/logo-light';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import { DashboardTrial } from '@/modules/dashboard/ui/components/dashboard-trial';
import { DashboardUserButton } from '@/modules/dashboard/ui/components/dashboard-user-button';
import {
  BotIcon,
  PanelLeftClose,
  PanelLeftOpen,
  StarIcon,
  VideoIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const firstSection = [
  {
    label: 'Meetings',
    href: '/meetings',
    icon: VideoIcon,
  },
  {
    label: 'Agents',
    href: '/agents',
    icon: BotIcon,
  },
];

const secondSection = [
  {
    label: 'Upgrade',
    href: '/upgrade',
    icon: StarIcon,
  },
];

const sections = [
  {
    label: 'General',
    items: firstSection,
  },
  {
    label: 'Settings',
    items: secondSection,
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const sidebar = useSidebar();

  return (
    <Sidebar collapsible='icon' className='box-content'>
      <SidebarHeader className='flex-row'>
        <Link href='/' className='hover:bg-muted rounded-xl p-1'>
          <LogoLight className='size-6' />
        </Link>
      </SidebarHeader>
      <div className='px-2'>
        <SidebarSeparator className='mx-[initial]' />
      </div>
      <SidebarContent>
        {sections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        {/* TODO: optimize UI when changing sidebar state */}
        {sidebar.open && <DashboardTrial />}
        {!sidebar.isMobile && (
          <div
            className='hover:bg-sidebar-accent flex size-8 cursor-pointer items-center justify-center rounded-xl'
            onClick={sidebar.toggleSidebar}
          >
            {sidebar.open ? (
              <PanelLeftClose className='size-4' />
            ) : (
              <PanelLeftOpen className='size-4' />
            )}
          </div>
        )}
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  );
};
