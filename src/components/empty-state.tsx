import { Empty } from '@/assets/icons/empty';

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState = ({ title, description }: EmptyStateProps) => {
  return (
    <div className='flex flex-col items-center justify-between'>
      <Empty className='size-[240px]' />
      <div className='flex max-w-md flex-col gap-y-6 text-center'>
        <h1 className='text-lg font-medium'>{title}</h1>
        <p className='text-muted-foreground text-sm'>{description}</p>
      </div>
    </div>
  );
};
