'use client';

import { ResponsiveDialog } from '@/components/responsive-dialog';
import { MeetingForm } from '@/modules/meetings/ui/components/meeting-form';
import { useRouter } from 'next/navigation';

interface NewMeetingDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const NewMeetingDialog = ({
  open,
  onOpenChange,
}: NewMeetingDialogProps) => {
  const router = useRouter();

  return (
    <ResponsiveDialog
      title='New meeting'
      description='Create a new meeting'
      open={open}
      onOpenChange={onOpenChange}
    >
      <MeetingForm
        onSuccess={(id) => {
          onOpenChange?.(false);
          if (id) {
            router.push(`/meetings/${id}`);
          }
        }}
        onCancel={() => {
          onOpenChange?.(false);
        }}
      />
    </ResponsiveDialog>
  );
};
