import { GeneratedAvatar } from '@/components/generated-avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatDuration } from '@/lib/utils';
import type { MeetingGetOne } from '@/modules/meetings/types';
import { format } from 'date-fns';
import {
  BookOpenText,
  ClockFading,
  FileText,
  FileVideoCamera,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import Markdown from 'react-markdown';

interface CompletedStateProps {
  data: MeetingGetOne;
}

export const CompletedState = ({ data }: CompletedStateProps) => {
  return (
    <Tabs defaultValue='summary'>
      <ScrollArea className='rounded-lg border bg-white'>
        <div className='px-3'>
          <TabsList className='bg-background h-13 rounded-none p-0'>
            {[
              {
                value: 'summary',
                label: 'Summary',
                icon: <BookOpenText />,
              },
              {
                value: 'transcript',
                label: 'Transcript',
                icon: <FileText />,
              },
              {
                value: 'recording',
                label: 'Recording',
                icon: <FileVideoCamera />,
              },
              {
                value: 'chat',
                label: 'Ask AI',
                icon: <Sparkles />,
              },
            ].map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className='text-muted-foreground bg-background data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground hover:text-accent-foreground h-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none'
              >
                {item.icon}
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
      <TabsContent value='recording'>
        <div className='rounded-lg border bg-white px-4 py-5'>
          <video
            src={data.recordingUrl ?? undefined}
            className='w-full rounded-lg'
            controls
          />
        </div>
      </TabsContent>
      <TabsContent value='summary'>
        <div className='rounded-lg border bg-white'>
          <div className='flex flex-col gap-y-5 px-4 py-5'>
            <h2 className='text-2xl font-medium capitalize'>{data.name}</h2>
            <div className='flex flex-col gap-2 md:flex-row md:items-center'>
              <Link
                href={`/agents/${data.agentId}`}
                target='_blank'
                className='flex items-center gap-x-2 capitalize underline underline-offset-4'
              >
                <GeneratedAvatar
                  variant='botttsNeutral'
                  seed={data.agent.name}
                  className='size-5'
                />
                {data.agent.name}
              </Link>
              {data.startedAt ? <p>{format(data.startedAt, 'PPP')}</p> : null}
            </div>
            <div className='flex items-center gap-x-2'>
              <Sparkles className='size-4' />
              <p>General summary</p>
            </div>
            <Badge variant='outline'>
              <ClockFading className='size-4 text-blue-700' />
              {data.duration ? formatDuration(data.duration) : 'No duration'}
            </Badge>
            <div>
              <Markdown
                components={{
                  h1: (props) => (
                    <h1
                      {...props}
                      className={cn(
                        'mb-6 text-2xl font-medium',
                        props.className,
                      )}
                    />
                  ),
                  h2: (props) => (
                    <h2
                      {...props}
                      className={cn(
                        'mb-6 text-xl font-medium',
                        props.className,
                      )}
                    />
                  ),
                  h3: (props) => (
                    <h3
                      {...props}
                      className={cn(
                        'mb-6 text-lg font-medium',
                        props.className,
                      )}
                    />
                  ),
                  h4: (props) => (
                    <h4
                      {...props}
                      className={cn(
                        'mb-6 text-base font-medium',
                        props.className,
                      )}
                    />
                  ),
                  p: (props) => (
                    <p
                      {...props}
                      className={cn('mb-6 leading-relaxed', props.className)}
                    />
                  ),
                  ul: (props) => (
                    <ul
                      {...props}
                      className={cn(
                        'mb-6 list-inside list-disc',
                        props.className,
                      )}
                    />
                  ),
                  ol: (props) => (
                    <ol
                      {...props}
                      className={cn(
                        'mb-6 list-inside list-decimal',
                        props.className,
                      )}
                    />
                  ),
                  li: (props) => (
                    <li {...props} className={cn('mb-1', props.className)} />
                  ),
                  strong: (props) => (
                    <strong
                      {...props}
                      className={cn('font-semibold', props.className)}
                    />
                  ),
                  code: (props) => (
                    <code
                      {...props}
                      className={cn(
                        'rounded bg-gray-100 px-1 py-0.5',
                        props.className,
                      )}
                    />
                  ),
                  blockquote: (props) => (
                    <blockquote
                      {...props}
                      className={cn(
                        'my-4 border-l-4 pl-4 italic',
                        props.className,
                      )}
                    />
                  ),
                }}
              >
                {data.summary}
              </Markdown>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
