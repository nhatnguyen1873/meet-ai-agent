import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT, MIN_LIMIT } from '@/constants';
import { db } from '@/db';
import { agents, meetings } from '@/db/schema';
import {
  meetingInsertSchema,
  meetingEditSchema,
} from '@/modules/meetings/schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { MEETING_STATUSES } from '@/types/meeting-status';
import { TRPCError } from '@trpc/server';
import { and, count, desc, eq, getTableColumns, ilike, sql } from 'drizzle-orm';
import * as z from 'zod';

export const meetingsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const [data] = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
            'duration',
          ),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
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
        agentId: z.string().nullish(),
        status: z.enum(MEETING_STATUSES).nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const andConditions = [
        eq(meetings.userId, ctx.auth.user.id),
        input.search ? ilike(meetings.name, `%${input.search}%`) : undefined,
        input.agentId ? eq(meetings.agentId, input.agentId) : undefined,
        input.status ? eq(meetings.status, input.status) : undefined,
      ];

      const innerJoinConds = [agents, eq(meetings.agentId, agents.id)] as const;

      const items = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
            'duration',
          ),
        })
        .from(meetings)
        .innerJoin(...innerJoinConds)
        .where(and(...andConditions))
        .orderBy(desc(meetings.createdAt), desc(meetings.id))
        .limit(input.limit)
        .offset((input.page - 1) * input.limit);

      const [total] = await db
        .select({ count: count() })
        .from(meetings)
        .innerJoin(...innerJoinConds)
        .where(and(...andConditions));

      const totalPages = Math.ceil(total.count / input.limit);

      return { items, totalPages, total: total.count };
    }),
  create: protectedProcedure
    .input(meetingInsertSchema)
    .mutation(async (opts) => {
      const [created] = await db
        .insert(meetings)
        .values({
          ...opts.input,
          userId: opts.ctx.auth.user.id,
        })
        .returning();

      return created;
    }),
  edit: protectedProcedure.input(meetingEditSchema).mutation(async (opts) => {
    const { id, ...input } = opts.input;
    const [edited] = await db
      .update(meetings)
      .set(input)
      .where(
        and(eq(meetings.id, id), eq(meetings.userId, opts.ctx.auth.user.id)),
      )
      .returning();

    if (!edited) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Meeting not found',
      });
    }

    return edited;
  }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => {
      const [deleted] = await db
        .delete(meetings)
        .where(
          and(
            eq(meetings.id, opts.input.id),
            eq(meetings.userId, opts.ctx.auth.user.id),
          ),
        )
        .returning();

      if (!deleted) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Meeting not found',
        });
      }

      return deleted;
    }),
});
