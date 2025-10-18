'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { generateAvatarUri } from '@/lib/avatar';
import {
  DefaultVideoPlaceholder,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
  type StreamVideoParticipant,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

interface CallLobbyProps {
  onJoin: () => void;
}

export const CallLobby = ({ onJoin }: CallLobbyProps) => {
  const callState = useCallStateHooks();
  const micState = callState.useMicrophoneState();
  const camState = callState.useCameraState();

  const hasBrowserMediaPermissions =
    micState.hasBrowserPermission && camState.hasBrowserPermission;

  return (
    <div className='flex h-full flex-col items-center justify-center bg-radial from-slate-700 to-slate-950'>
      <div className='flex grow items-center justify-center px-8 py-4'>
        <div className='bg-background flex flex-col items-center justify-center gap-y-6 rounded-lg p-10 shadow-sm'>
          <div className='flex flex-col gap-y-2 text-center'>
            <h6 className='text-lg font-medium'>Ready to join?</h6>
            <p className='text-sm'>Set up your call before joining</p>
          </div>
          <VideoPreview
            DisabledVideoPreview={
              hasBrowserMediaPermissions
                ? DisabledVideoPreview
                : AllowBrowserPermissions
            }
          />
          <div className='flex gap-x-2'>
            <ToggleAudioPreviewButton />
            <ToggleVideoPreviewButton />
          </div>
          <div className='flex w-full justify-between gap-x-2'>
            <Button asChild variant={'ghost'}>
              <Link href='/meetings'>Cancel</Link>
            </Button>
            <Button onClick={onJoin}>
              <LogIn />
              Join
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

function DisabledVideoPreview() {
  const session = authClient.useSession();

  const user = session.data?.user;

  return (
    <DefaultVideoPlaceholder
      participant={
        {
          name: user?.name ?? '',
          image:
            user?.image ??
            generateAvatarUri({ seed: user?.name ?? '', variant: 'initials' }),
        } as StreamVideoParticipant
      }
    />
  );
}

function AllowBrowserPermissions() {
  return (
    <p className='text-sm'>
      Please grant your browser a permission to access your camera and
      microphone.
    </p>
  );
}
