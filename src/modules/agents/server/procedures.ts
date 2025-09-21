import { db } from '@/db';
import { agents } from '@/db/schema';
import { agentInsertSchema } from '@/modules/agents/schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { eq } from 'drizzle-orm';
import z from 'zod';

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const [data] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, opts.input.id));

      return data;
    }),
  getMany: protectedProcedure.query(async () => {
    const data = await db.select().from(agents);

    return data;
  }),
  create: protectedProcedure.input(agentInsertSchema).mutation(async (opts) => {
    const [data] = await db
      .insert(agents)
      .values({
        ...opts.input,
        userId: opts.ctx.auth.user.id,
      })
      .returning();

    return data;
  }),
});
