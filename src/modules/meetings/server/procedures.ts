import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT, MIN_LIMIT } from '@/constants';
import { db } from '@/db';
import { meetings } from '@/db/schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { and, count, desc, eq, ilike } from 'drizzle-orm';
import * as z from 'zod';

export const meetingsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const [data] = await db
        .select()
        .from(meetings)
        .where(
          and(
            eq(meetings.id, opts.input.id),
            eq(meetings.userId, opts.ctx.auth.user.id),
          ),
        );

      if (!data) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Meeting not found',
        });
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
        eq(meetings.userId, ctx.auth.user.id),
        input.search ? ilike(meetings.name, `%${input.search}%`) : undefined,
      ];

      const items = await db
        .select()
        .from(meetings)
        .where(and(...andConditions))
        .orderBy(desc(meetings.createdAt), desc(meetings.id))
        .limit(input.limit)
        .offset((input.page - 1) * input.limit);

      const [total] = await db
        .select({ count: count() })
        .from(meetings)
        .where(and(...andConditions));

      const totalPages = Math.ceil(total.count / input.limit);

      return { items, totalPages, total: total.count };
    }),
});
