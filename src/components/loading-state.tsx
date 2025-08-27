import { LoaderCircle } from 'lucide-react';

interface LoadingStateProps {
  title: string;
  description: string;
}

export const LoadingState = ({ title, description }: LoadingStateProps) => {
  return (
    <div className='bg-background flex flex-col items-center justify-center gap-y-6 rounded-lg p-10 shadow-sm'>
      <LoaderCircle className='text-primary size-6 animate-spin' />
      <div className='flex flex-col gap-y-2 text-center'>
        <h1 className='text-lg font-medium'>{title}</h1>
        <p className='text-sm'>{description}</p>
      </div>
    </div>
  );
};
