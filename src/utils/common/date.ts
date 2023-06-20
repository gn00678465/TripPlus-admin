import dayjs, { type Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export function utc2Local(date: string): Dayjs {
  return dayjs(date).local();
}
