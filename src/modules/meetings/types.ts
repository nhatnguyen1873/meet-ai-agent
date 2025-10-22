import type { AppRouter } from '@/trpc/routers/_app';
import type { inferRouterOutputs } from '@trpc/server';

export type MeetingGetOne = inferRouterOutputs<AppRouter>['meetings']['getOne'];

export type MeetingGetMany =
  inferRouterOutputs<AppRouter>['meetings']['getMany'];

export type CustomCallCreateData = {
  meetingId: string;
  meetingName: string;
};

export interface StreamTranscriptItem {
  type: string;
  start_ts: number;
  stop_ts: number;
  speaker_id: string;
  text: string;
}
