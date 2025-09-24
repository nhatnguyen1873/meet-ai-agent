'use client';

import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { createContext, ReactNode, useEffect, useState } from 'react';

export interface ConfirmParams {
  title: string;
  description: string;
}

export interface ConfirmContextValue {
  confirm: (params: ConfirmParams) => Promise<boolean>;
}

export const ConfirmContext = createContext<ConfirmContextValue | undefined>(
  undefined,
);

interface ConfirmProviderProps {
  children: ReactNode;
}

export const ConfirmProvider = ({ children }: ConfirmProviderProps) => {
  const [promise, setPromise] = useState<
    { resolve: (bool: boolean) => void } | undefined
  >(undefined);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const confirm: ConfirmContextValue['confirm'] = (params) => {
    setTitle(params.title);
    setDescription(params.description);
    return new Promise<boolean>((resolve) => {
      setPromise({ resolve });
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      promise?.resolve(false);
      setPromise(undefined);
    }
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    setPromise(undefined);
  };

  const handleCancel = () => {
    promise?.resolve(false);
    setPromise(undefined);
  };

  useEffect(() => {
    return () => {
      promise?.resolve(false);
    };
  }, [promise]);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      <ResponsiveDialog
        title={title}
        description={description}
        open={!!promise}
        onOpenChange={handleOpenChange}
      >
        <div className='flex flex-col-reverse gap-2 md:flex-row md:justify-end'>
          <Button variant='outline' onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </div>
      </ResponsiveDialog>
      {children}
    </ConfirmContext.Provider>
  );
};
