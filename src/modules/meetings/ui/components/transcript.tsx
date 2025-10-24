'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { generateAvatarUri } from '@/lib/avatar';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useState } from 'react';
import Highlighter from 'react-highlight-words';

interface TranscriptProps {
  meetingId: string;
}

export const Transcript = ({ meetingId }: TranscriptProps) => {
  const trpc = useTRPC();
  const getTranscript = useQuery(
    trpc.meetings.getTranscript.queryOptions({ id: meetingId }),
  );
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTranscripts =
    getTranscript.data?.filter((item) => {
      return item.text.toLowerCase().includes(searchQuery.toLowerCase());
    }) ?? [];

  return (
    <div className='flex flex-col gap-y-4 rounded-lg border bg-white px-4 py-5'>
      <p className='text-sm font-medium'>Transcript</p>
      <Input
        placeholder='Search transcript'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className='h-9 w-60'
      />
      <div className='flex flex-col gap-y-4'>
        {filteredTranscripts.map((item) => (
          <div
            key={item.start_ts}
            className='hover:bg-muted flex flex-col gap-y-2 rounded-md border p-4'
          >
            <div className='flex items-center gap-x-2'>
              <Avatar className='size-6'>
                <AvatarImage
                  src={
                    item.user.image ??
                    generateAvatarUri({
                      seed: item.user.name,
                      variant: 'initials',
                    })
                  }
                  alt='User Avatar'
                />
              </Avatar>
              <p className='text-sm font-medium'>{item.user.name}</p>
              <p className='text-sm font-medium text-blue-500'>
                {format(new Date(0, 0, 0, 0, 0, 0, item.start_ts), 'mm:ss')}
              </p>
            </div>
            <Highlighter
              searchWords={[searchQuery]}
              textToHighlight={item.text}
              autoEscape
              highlightClassName='bg-yellow-200'
              className='text-sm text-neutral-700'
            />
          </div>
        ))}
      </div>
    </div>
  );
};
