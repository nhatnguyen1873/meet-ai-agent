import * as z from 'zod';

export const meetingInsertSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  agentId: z.string().min(1, 'Agent is required'),
});

export const meetingEditSchema = z.object({
  ...meetingInsertSchema.shape,
  id: z.string().min(1, 'Id is required'),
});
