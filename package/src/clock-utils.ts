import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// Extend dayjs with timezone support
dayjs.extend(utc);
dayjs.extend(timezone);

// --- Constants ---
export const TICK_OFFSET_RATIO = 0.028;
export const CENTER_DOT_RATIO = 0.034;
export const COUNTERWEIGHT_MULTIPLIER = 3;

export const round2 = (n: number): number => Math.round(n * 100) / 100;

/**
 * Parse various time value formats into a Date object
 */
export const defaultClockProps = {
  size: 400,
  hourHandSize: 0.017,
  minuteHandSize: 0.011,
  secondHandSize: 0.006,
  hourHandLength: 0.4,
  minuteHandLength: 0.57,
  secondHandLength: 0.68,
  secondHandOpacity: 1,
  minuteHandOpacity: 1,
  hourHandOpacity: 1,
  secondHandBehavior: 'tick' as const,
  running: true,
};

export const parseTimeValue = (value: string | Date | dayjs.Dayjs | undefined): Date | null => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  if (dayjs.isDayjs(value)) {
    return value.toDate();
  }

  if (typeof value === 'string') {
    // Handle time string formats like "10:30", "18:15:07", etc.
    const timeRegex = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/;
    const match = value.match(timeRegex);

    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const seconds = parseInt(match[3] || '0', 10);

      const date = new Date();
      date.setHours(hours, minutes, seconds, 0);
      return date;
    }

    // Try to parse as a full date string
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return null;
};
