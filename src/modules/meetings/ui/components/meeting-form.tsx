'use client';

import { CommandSelect } from '@/components/command-select';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { NewAgentDialog } from '@/modules/agents/components/new-agent-dialog';
import { meetingInsertSchema } from '@/modules/meetings/schema';
import type { MeetingGetOne } from '@/modules/meetings/types';
import { useTRPC } from '@/trpc/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

type MeetingInsertValues = z.infer<typeof meetingInsertSchema>;

interface MeetingFormProps {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialData?: MeetingGetOne;
}

export const MeetingForm = ({
  onSuccess,
  onCancel,
  initialData,
}: MeetingFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [agentDialogOpen, setAgentDialogOpen] = useState(false);
  const [agentsSearch, setAgentsSearch] = useState('');

  const getAgents = useQuery(
    trpc.agents.getMany.queryOptions({
      limit: 100,
      search: agentsSearch,
    }),
  );

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );
        await queryClient.invalidateQueries(
          trpc.premium.getFreeUsage.queryOptions(),
        );
        onSuccess?.(data.id);
        toast.success('Meeting created successfully');
      },
      onError: (error) => {
        toast.error(error.message);

        if (error.data?.code === 'FORBIDDEN') {
          router.push('/upgrade');
        }
      },
    }),
  );
  const editMeeting = useMutation(
    trpc.meetings.edit.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );

        if (initialData?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({ id: initialData.id }),
          );
        }

        onSuccess?.();
        toast.success('Meeting edited successfully');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );
  const form = useForm<MeetingInsertValues>({
    resolver: zodResolver(meetingInsertSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      agentId: initialData?.agentId,
    },
  });

  const isEdit = !!initialData?.id;

  const handleSubmit = (values: MeetingInsertValues) => {
    if (isEdit) {
      editMeeting.mutate({
        id: initialData.id,
        ...values,
      });
    } else {
      createMeeting.mutate(values);
    }
  };

  return (
    <>
      <NewAgentDialog
        open={agentDialogOpen}
        onOpenChange={setAgentDialogOpen}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className='flex flex-col gap-y-4'
        >
          <FormField
            name='name'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='e.g. Meeting with client' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name='agentId'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent</FormLabel>
                <FormControl>
                  <CommandSelect
                    options={getAgents.data?.items.map((item) => ({
                      id: item.id,
                      value: item.id,
                      label: item.name,
                    }))}
                    placeholder='Select an agent'
                    {...field}
                    onSelect={field.onChange}
                    onSearch={(value) => {
                      setAgentsSearch(value);
                    }}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Not found what you&apos;re looking for?{' '}
                  <button
                    type='button'
                    onClick={() => {
                      setAgentDialogOpen(true);
                    }}
                    className='text-primary hover:underline'
                  >
                    Create a new agent
                  </button>
                </FormDescription>
              </FormItem>
            )}
          />
          <div className='flex justify-end gap-2'>
            {onCancel && (
              <Button
                type='button'
                variant={'ghost'}
                disabled={createMeeting.isPending}
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            <Button
              type='submit'
              disabled={createMeeting.isPending || editMeeting.isPending}
            >
              {isEdit ? 'Save' : 'Create'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
