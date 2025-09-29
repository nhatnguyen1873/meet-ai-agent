import { DEFAULT_PAGE } from '@/constants';
import { MEETING_STATUSES } from '@/types/meeting-status';
import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs/server';

const filterSearchParams = {
  search: parseAsString.withDefault('').withOptions({
    clearOnDefault: true,
  }),
  page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({
    clearOnDefault: true,
  }),
  status: parseAsStringEnum(Object.values(MEETING_STATUSES)),
  agentId: parseAsString.withDefault('').withOptions({
    clearOnDefault: true,
  }),
};

export const loadMeetingSearchParams = createLoader(filterSearchParams);
