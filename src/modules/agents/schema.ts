import z from 'zod';

export const agentInsertSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  instructions: z.string().min(1, 'Instructions are required'),
});

export const agentUpdateSchema = z.object({
  ...agentInsertSchema.shape,
  id: z.string().min(1, 'ID is required'),
});
