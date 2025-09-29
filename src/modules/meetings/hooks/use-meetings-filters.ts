import { DEFAULT_PAGE } from '@/constants';
import { MEETING_STATUSES } from '@/types/meeting-status';
import {
  useQueryStates,
  parseAsString,
  parseAsInteger,
  parseAsStringEnum,
} from 'nuqs';

export const useMeetingsFilters = () => {
  return useQueryStates({
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
  });
};
