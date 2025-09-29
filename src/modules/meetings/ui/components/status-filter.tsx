'use client';

import { CommandSelect } from '@/components/command-select';
import { useMeetingsFilters } from '@/modules/meetings/hooks/use-meetings-filters';
import { MEETING_STATUSES } from '@/types/meeting-status';
import {
  CircleCheck,
  CircleX,
  ClockArrowUp,
  Loader,
  Video,
} from 'lucide-react';
import { useMemo } from 'react';

export const StatusFilter = () => {
  const options = useMemo(() => {
    const sharedClassName = 'flex items-center gap-x-2 capitalize';

    return [
      {
        id: MEETING_STATUSES.upcoming,
        value: MEETING_STATUSES.upcoming,
        label: (
          <div className={sharedClassName}>
            <ClockArrowUp />
            {MEETING_STATUSES.upcoming}
          </div>
        ),
      },
      {
        id: MEETING_STATUSES.completed,
        value: MEETING_STATUSES.completed,
        label: (
          <div className={sharedClassName}>
            <CircleCheck />
            {MEETING_STATUSES.completed}
          </div>
        ),
      },
      {
        id: MEETING_STATUSES.active,
        value: MEETING_STATUSES.active,
        label: (
          <div className={sharedClassName}>
            <Video />
            {MEETING_STATUSES.active}
          </div>
        ),
      },
      {
        id: MEETING_STATUSES.processing,
        value: MEETING_STATUSES.processing,
        label: (
          <div className={sharedClassName}>
            <Loader />
            {MEETING_STATUSES.processing}
          </div>
        ),
      },
      {
        id: MEETING_STATUSES.cancelled,
        value: MEETING_STATUSES.cancelled,
        label: (
          <div className={sharedClassName}>
            <CircleX />
            {MEETING_STATUSES.cancelled}
          </div>
        ),
      },
    ];
  }, []);

  const [meetingFilters, setMeetingFilters] = useMeetingsFilters();

  return (
    <CommandSelect
      placeholder='Status'
      value={meetingFilters.status ?? ''}
      options={options}
      onSelect={(value) => {
        setMeetingFilters({
          status: value || null,
        });
      }}
    />
  );
};
