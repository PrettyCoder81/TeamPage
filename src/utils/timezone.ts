import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend dayjs with timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Set default timezone to EST (Eastern Standard Time)
// America/New_York handles both EST and EDT automatically
export const EST_TIMEZONE = 'America/New_York';

// Set dayjs default timezone
dayjs.tz.setDefault(EST_TIMEZONE);

/**
 * Get current date/time in EST
 */
export const getESTNow = () => {
  return dayjs().tz(EST_TIMEZONE);
};

/**
 * Convert any date to EST timezone
 */
export const toEST = (date: string | Date | dayjs.Dayjs) => {
  return dayjs(date).tz(EST_TIMEZONE);
};

/**
 * Format date in EST timezone
 */
export const formatEST = (
  date: string | Date | dayjs.Dayjs,
  format: string = 'YYYY-MM-DD HH:mm:ss'
) => {
  return toEST(date).format(format);
};

/**
 * Get EST date string (YYYY-MM-DD)
 */
export const getESTDateString = (date: string | Date | dayjs.Dayjs = new Date()) => {
  return toEST(date).format('YYYY-MM-DD');
};

/**
 * Get EST timestamp (ISO string)
 */
export const getESTTimestamp = (date: string | Date | dayjs.Dayjs = new Date()) => {
  return toEST(date).toISOString();
};

/**
 * Check if a date is today in EST
 */
export const isTodayEST = (date: string | Date | dayjs.Dayjs) => {
  return toEST(date).format('YYYY-MM-DD') === getESTNow().format('YYYY-MM-DD');
};

/**
 * Get start of day in EST
 */
export const getESTStartOfDay = (date: string | Date | dayjs.Dayjs = new Date()) => {
  return toEST(date).startOf('day');
};

/**
 * Get end of day in EST
 */
export const getESTEndOfDay = (date: string | Date | dayjs.Dayjs = new Date()) => {
  return toEST(date).endOf('day');
};

/**
 * Format relative time in EST (e.g., "2 hours ago")
 */
export const formatRelativeEST = (date: string | Date | dayjs.Dayjs) => {
  const estDate = toEST(date);
  const now = getESTNow();
  const diffMinutes = now.diff(estDate, 'minute');
  const diffHours = now.diff(estDate, 'hour');
  const diffDays = now.diff(estDate, 'day');

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return estDate.format('MMM D, YYYY');
};

export default dayjs;
