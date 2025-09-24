import {
  ConfirmContext,
  type ConfirmParams,
} from '@/contexts/confirm/confirm-provider';
import { useContext } from 'react';

export const useConfirm = (defaultParams: ConfirmParams) => {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }

  const confirm = ({
    title = defaultParams.title,
    description = defaultParams.description,
  }) =>
    context.confirm({
      title,
      description,
    });

  return { confirm };
};
