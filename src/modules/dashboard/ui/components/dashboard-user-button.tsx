'use client';

import { GeneratedAvatar } from '@/components/generated-avatar';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { authClient } from '@/lib/auth-client';
import { CreditCardIcon, LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const DashboardUserButton = () => {
  const router = useRouter();
  const authSession = authClient.useSession();

  const user = authSession.data?.user;

  const handleLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in');
        },
      },
    });
  };

  if (!user) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className='h-[initial]'>
              {user.image ? (
                <Avatar>
                  <AvatarImage src={user.image} />
                </Avatar>
              ) : (
                <GeneratedAvatar seed={user.name} variant={'initials'} />
              )}
              <div className='flex flex-col gap-0.5'>
                <p className='w-full truncate text-sm'>{user.name}</p>
                <p className='w-full truncate text-xs'>{user.email}</p>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-(--radix-popper-anchor-width)'>
            <DropdownMenuLabel>
              <div className='flex flex-col gap-1'>
                <p className='truncate font-medium'>{user.name}</p>
                <p className='text-muted-foreground truncate text-sm'>
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {[
              {
                label: 'Billing',
                icon: CreditCardIcon,
              },
              {
                label: 'Logout',
                onClick: handleLogout,
                icon: LogOutIcon,
              },
            ].map((item, index) => (
              <DropdownMenuItem
                key={index}
                onClick={item.onClick}
                className='flex cursor-pointer items-center justify-between'
              >
                {item.label}
                <item.icon className='size-4' />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
