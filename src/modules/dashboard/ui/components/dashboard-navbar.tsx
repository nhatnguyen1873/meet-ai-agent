'use client';

import { Button } from '@/components/ui/button';
import { Menu, Search } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { DashboardCommand } from '@/modules/dashboard/ui/components/dashboard-command';
import { useEffect, useState } from 'react';

export const DashboardNavbar = () => {
  const sidebar = useSidebar();
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
      <nav className='bg-background flex items-center gap-x-2 px-4 py-3'>
        {sidebar.isMobile && (
          <Button
            variant={'ghost'}
            size={'icon'}
            onClick={sidebar.toggleSidebar}
          >
            <Menu />
          </Button>
        )}
        <Button
          variant={'outline'}
          size={'sm'}
          onClick={() => {
            setCommandOpen((open) => !open);
          }}
          className='h-9 w-60 justify-start font-normal'
        >
          <Search />
          Search
          <kbd className='bg-muted text-muted-foreground pointer-events-none ml-auto flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[0.625rem] font-medium select-none'>
            <span className='text-xs'>&#8984;</span>K
          </kbd>
        </Button>
      </nav>
    </>
  );
};
