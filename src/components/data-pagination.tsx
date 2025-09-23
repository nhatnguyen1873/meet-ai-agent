import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DataPaginationProps {
  totalPages: number;
  page: number;
  onPageChange: (page: number) => void;
}

export const DataPagination = ({
  totalPages,
  page,
  onPageChange,
}: DataPaginationProps) => {
  return (
    <div className='flex items-center justify-between'>
      <p className='text-muted-foreground text-sm'>
        Page {page} of {totalPages}
      </p>
      <div className='flex items-center gap-2'>
        {[
          {
            key: 'prev',
            onClick: () => {
              onPageChange(Math.max(page - 1, 1));
            },
            disabled: page === 1 || !totalPages,
            Icon: ChevronLeft,
          },
          {
            key: 'next',
            onClick: () => {
              onPageChange(Math.min(page + 1, totalPages));
            },
            disabled: page === totalPages || !totalPages,
            Icon: ChevronRight,
          },
        ].map((item) => (
          <Button
            key={item.key}
            variant='outline'
            size='icon'
            onClick={item.onClick}
            disabled={item.disabled}
          >
            <item.Icon />
          </Button>
        ))}
      </div>
    </div>
  );
};
