import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT, MIN_LIMIT } from '@/constants';
import { db } from '@/db';
import { agents, meetings, user } from '@/db/schema';
import { generateAvatarUri } from '@/lib/avatar';
import { streamChat } from '@/lib/stream-chat';
import { streamVideo } from '@/lib/stream-video';
import {
  meetingInsertSchema,
  meetingEditSchema,
} from '@/modules/meetings/schema';
import type {
  CustomCallCreateData,
  StreamTranscriptItem,
} from '@/modules/meetings/types';
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from '@/trpc/init';
import { MEETING_STATUSES } from '@/types/meeting-status';
import { TRPCError } from '@trpc/server';
import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  inArray,
  sql,
} from 'drizzle-orm';
import JSONL from 'jsonl-parse-stringify';
import * as z from 'zod';

export const meetingsRouter = createTRPCRouter({
  generateChatToken: protectedProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx.auth;

    await streamChat.upsertUsers([
      {
        id: user.id,
        role: 'admin',
      },
    ]);

    return streamChat.createToken(user.id);
  }),
  getTranscript: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [existingMeeting] = await db
        .select()
        .from(meetings)
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id)),
        );

      if (!existingMeeting) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Meeting not found',
        });
      }

      if (!existingMeeting.transcriptUrl) {
        return [];
      }

      const transcripts = await fetch(existingMeeting.transcriptUrl)
        .then((res) => res.text())
        .then((text) => JSONL.parse<StreamTranscriptItem>(text))
        .catch(() => []);

      const speakerIds = [
        ...new Set(transcripts.map((item) => item.speaker_id)),
      ];

      const userSpeakers = await db
        .select()
        .from(user)
        .where(inArray(user.id, speakerIds))
        .then((users) =>
          users.map((user) => ({
            ...user,
            image:
              user.image ??
              generateAvatarUri({ seed: user.name, variant: 'initials' }),
          })),
        );

      const agentSpeakers = await db
        .select()
        .from(agents)
        .where(inArray(agents.id, speakerIds))
        .then((agents) =>
          agents.map((agent) => ({
            ...agent,
            image: generateAvatarUri({
              seed: agent.name,
              variant: 'botttsNeutral',
            }),
          })),
        );

      const speakers = [...userSpeakers, ...agentSpeakers];

      const transcriptWithSpeakers = transcripts.map((transcript) => {
        const speaker = speakers.find(
          (speaker) => speaker.id === transcript.speaker_id,
        );

        if (!speaker) {
          return {
            ...transcript,
            user: {
              name: 'Unknown',
              image: generateAvatarUri({
                seed: 'Unknown',
                variant: 'initials',
              }),
            },
          };
        }

        return {
          ...transcript,
          user: {
            name: speaker.name,
            image: speaker.image,
          },
        };
      });

      return transcriptWithSpeakers;
    }),
  generateToken: protectedProcedure.mutation(async (opts) => {
    const { user } = opts.ctx.auth;

    await streamVideo.upsertUsers([
      {
        id: user.id,
        name: user.name,
        role: 'admin',
        image:
          user.image ??
          generateAvatarUri({ seed: user.name, variant: 'initials' }),
      },
    ]);

    return streamVideo.generateUserToken({
      user_id: user.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    });
  }),
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
  create: premiumProcedure('meetings')
    .input(meetingInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.auth;

      const [createdMeeting] = await db
        .insert(meetings)
        .values({
          ...input,
          userId: user.id,
        })
        .returning();

      const call = streamVideo.video.call('default', createdMeeting.id);

      await call.create({
        data: {
          created_by_id: user.id,
          custom: {
            meetingId: createdMeeting.id,
            meetingName: createdMeeting.name,
          } as CustomCallCreateData,
          settings_override: {
            transcription: {
              language: 'en',
              mode: 'auto-on',
              closed_caption_mode: 'auto-on',
            },
            recording: {
              mode: 'auto-on',
              quality: '1080p',
            },
          },
        },
      });

      const [existingAgent] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, createdMeeting.agentId));

      if (!existingAgent) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Agent not found',
        });
      }

      await streamVideo.upsertUsers([
        {
          id: existingAgent.id,
          name: existingAgent.name,
          role: 'user',
          image: generateAvatarUri({
            seed: existingAgent.name,
            variant: 'botttsNeutral',
          }),
        },
      ]);

      return createdMeeting;
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
