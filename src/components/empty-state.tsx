import {
  State,
  StateContent,
  StateIcon,
  StateTitle,
  StateDescription,
} from '@/components/state';

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState = ({ title, description }: EmptyStateProps) => {
  return (
    <State>
      <StateIcon />
      <StateContent>
        <StateTitle>{title}</StateTitle>
        <StateDescription>{description}</StateDescription>
      </StateContent>
    </State>
  );
};
