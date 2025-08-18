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
} from '@/components/ui/sidebar';
import { DashboardUserButton } from '@/modules/dashboard/ui/components/dashboard-user-button';
import { BotIcon, StarIcon, VideoIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const firstSection = [
  {
    label: 'Meeting',
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

export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className='flex-row'>
        <Link href='/' className='hover:bg-muted rounded-xl p-2'>
          <LogoLight className='h-6 w-9' />
        </Link>
      </SidebarHeader>
      <div className='px-2'>
        <SidebarSeparator className='mx-[initial]' />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className='size-4' />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondSection.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className='size-4' />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  );
};
