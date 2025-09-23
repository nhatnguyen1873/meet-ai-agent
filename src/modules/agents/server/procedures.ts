import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT, MIN_LIMIT } from '@/constants';
import { db } from '@/db';
import { agents } from '@/db/schema';
import { agentInsertSchema } from '@/modules/agents/schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { and, count, desc, eq, getTableColumns, ilike, sql } from 'drizzle-orm';
import z from 'zod';

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const [data] = await db
        .select({
          meetingCount: sql<number>`5`,
          ...getTableColumns(agents),
        })
        .from(agents)
        .where(
          and(
            eq(agents.id, opts.input.id),
            eq(agents.userId, opts.ctx.auth.user.id),
          ),
        );

      if (!data) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found' });
      }

      return data;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        limit: z.number().min(MIN_LIMIT).max(MAX_LIMIT).default(DEFAULT_LIMIT),
        search: z.string().nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const andConditions = [
        eq(agents.userId, ctx.auth.user.id),
        input.search ? ilike(agents.name, `%${input.search}%`) : undefined,
      ];

      const items = await db
        .select({
          ...getTableColumns(agents),

          // TODO: change this to actual meeting count
          meetingCount: sql<number>`5`,
        })
        .from(agents)
        .where(and(...andConditions))
        .orderBy(desc(agents.createdAt), desc(agents.id))
        .limit(input.limit)
        .offset((input.page - 1) * input.limit);

      const [total] = await db
        .select({ count: count() })
        .from(agents)
        .where(and(...andConditions));

      const totalPages = Math.ceil(total.count / input.limit);

      return { items, totalPages, total: total.count };
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
