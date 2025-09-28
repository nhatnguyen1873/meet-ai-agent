import { ResponsiveDialog } from '@/components/responsive-dialog';
import { AgentForm } from '@/modules/agents/components/agent-form';

interface NewAgentDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const NewAgentDialog = ({ open, onOpenChange }: NewAgentDialogProps) => {
  return (
    <ResponsiveDialog
      title='New agent'
      description='Add a new agent'
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentForm
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
