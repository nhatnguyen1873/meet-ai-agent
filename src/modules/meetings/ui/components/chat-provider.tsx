'use client';

import { LoadingState } from '@/components/loading-state';
import { authClient } from '@/lib/auth-client';
import { ChatUI } from '@/modules/meetings/ui/components/chat-ui';

interface ChatProviderProps {
  meetingId: string;
}

export const ChatProvider = ({ meetingId }: ChatProviderProps) => {
  const session = authClient.useSession();

  if (!session.data && session.isPending) {
    return (
      <LoadingState
        title='Loading'
        description='Please wait while we load the chat'
      />
    );
  }

  return (
    <ChatUI
      meetingId={meetingId}
      userId={session.data?.user.id ?? ''}
      userName={session.data?.user.name ?? ''}
      userImage={session.data?.user.image ?? ''}
    />
  );
};
