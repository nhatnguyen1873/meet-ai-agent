import { CircleAlert } from 'lucide-react';

interface ErrorStateProps {
  title: string;
  description: string;
}

export const ErrorState = ({ title, description }: ErrorStateProps) => {
  return (
    <div className='bg-background flex flex-col items-center justify-center gap-y-6 rounded-lg p-10 shadow-sm'>
      <CircleAlert className='text-destructive size-6' />
      <div className='flex flex-col gap-y-2 text-center'>
        <h1 className='text-lg font-medium'>{title}</h1>
        <p className='text-sm'>{description}</p>
      </div>
    </div>
  );
};
