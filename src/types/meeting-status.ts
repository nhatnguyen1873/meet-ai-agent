export const MEETING_STATUSES = {
  upcoming: 'upcoming',
  active: 'active',
  completed: 'completed',
  processing: 'processing',
  cancelled: 'cancelled',
} as const;

export type MeetingStatus =
  (typeof MEETING_STATUSES)[keyof typeof MEETING_STATUSES];
