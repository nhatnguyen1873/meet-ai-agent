import { ResponsiveDialog } from '@/components/responsive-dialog';
import type { MeetingGetOne } from '@/modules/meetings/types';
import { MeetingForm } from '@/modules/meetings/ui/components/meeting-form';

interface EditMeetingDialogProps {
  open?: boolean;
  initialData?: MeetingGetOne;
  onOpenChange?: (open: boolean) => void;
}

export const EditMeetingDialog = ({
  open,
  initialData,
  onOpenChange,
}: EditMeetingDialogProps) => {
  return (
    <ResponsiveDialog
      title='Edit meeting'
      description='Edit the meeting details'
      open={open}
      onOpenChange={onOpenChange}
    >
      <MeetingForm
        initialData={initialData}
        onSuccess={() => {
          onOpenChange?.(false);
        }}
        onCancel={() => {
          onOpenChange?.(false);
        }}
      />
    </ResponsiveDialog>
  );
};
