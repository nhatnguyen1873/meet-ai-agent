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

  const sharedAvatarClassName = 'size-6' as const;

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
            <SidebarMenuButton className='h-[initial] p-1 group-data-[collapsible=icon]:p-1!'>
              {user.image ? (
                <Avatar className={sharedAvatarClassName}>
                  <AvatarImage src={user.image} />
                </Avatar>
              ) : (
                <GeneratedAvatar
                  seed={user.name}
                  variant={'initials'}
                  className={sharedAvatarClassName}
                />
              )}
              <div className='flex flex-col gap-0.5'>
                <p className='w-full truncate text-sm'>{user.name}</p>
                <p className='w-full truncate text-xs'>{user.email}</p>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' className='w-60'>
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
                onClick: () => authClient.customer.portal(),
              },
              {
                label: 'Logout',
                icon: LogOutIcon,
                onClick: handleLogout,
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
