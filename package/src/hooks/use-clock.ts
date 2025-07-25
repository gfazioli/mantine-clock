import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import timezonePlugin from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { useEffect, useState } from 'react';

dayjs.extend(utc);
dayjs.extend(timezonePlugin);
dayjs.extend(weekOfYear);
dayjs.extend(isLeapYear);

/**
 * Options for configuring the `useClock` hook.
 */
interface UseClockOptions {
  /** Whether the clock is active and updating. */
  enabled?: boolean;
  /** The timezone to use for the clock. */
  timezone?: string;
  /** The frequency (in milliseconds) at which the clock updates. */
  updateFrequency?: number;
  /** Whether to use 24-hour format or 12-hour format. */
  use24Hours?: boolean;
  /** Whether to pad single-digit seconds with a leading zero. */
  padSeconds?: boolean;
  /** Whether to pad single-digit minutes with a leading zero. */
  padMinutes?: boolean;
  /** Whether to pad single-digit hours with a leading zero. */
  padHours?: boolean;
}

/**
 * Data returned by the `useClock` hook.
 */
interface ClockData {
  /** The current year. */
  year: number;
  /** The current month (1-12). */
  month: number;
  /** The current day of the month. */
  day: number;
  /** The current week of the year. */
  week: number;
  /** Whether the current year is a leap year. */
  isLeap: boolean;
  /** The current hour (adjusted for 12/24-hour format). */
  hours: number | string;
  /** The current minute. */
  minutes: number | string;
  /** The current second. */
  seconds: number | string;
  /** The current millisecond. */
  milliseconds: number;
  /** Whether the time is AM or PM (only relevant if use24Hours is false). */
  amPm?: 'AM' | 'PM';
}

/**
 * `useClock` is a React hook that provides real-time clock data.
 *
 * This hook allows you to track the current time with options for timezone,
 * update frequency, and 12/24-hour format. It returns an object containing
 * detailed time information such as year, month, day, week, and more.
 *
 * @param {UseClockOptions} options - Configuration options for the clock.
 * @returns {ClockData} An object containing the current time data.
 *
 * @example
 * const { year, month, day, hours, minutes, seconds } = useClock({
 *   timezone: 'America/New_York',
 *   updateFrequency: 1000,
 *   use24Hours: false,
 * });
 */
export function useClock({
  enabled = true,
  timezone = 'UTC',
  updateFrequency = 1000,
  use24Hours = true,
  padSeconds = false,
  padMinutes = false,
  padHours = false,
}: UseClockOptions): ClockData {
  const [time, setTime] = useState(() => dayjs().tz(timezone));

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const updateClock = () => {
      setTime(dayjs().tz(timezone));
    };

    updateClock();
    const interval = setInterval(updateClock, updateFrequency);

    return () => clearInterval(interval);
  }, [enabled, timezone, updateFrequency]);

  const year = time.year();
  const month = time.month() + 1; // Months are 0-indexed in dayjs
  const day = time.date();
  const week = time.week();
  const isLeap = time.isLeapYear();
  let hours: number | string = time.hour();
  let minutes: number | string = time.minute();
  let seconds: number | string = time.second();
  const milliseconds = time.millisecond();

  let amPm: 'AM' | 'PM' | undefined;
  if (!use24Hours) {
    amPm = Number(hours) >= 12 ? 'PM' : 'AM';
    hours = Number(hours) % 12 || 12; // Convert to 12-hour format
  }

  if (padHours) {
    hours = hours.toString().padStart(2, '0');
  }
  if (padMinutes) {
    minutes = minutes.toString().padStart(2, '0');
  }
  if (padSeconds) {
    seconds = seconds.toString().padStart(2, '0');
  }

  return {
    year,
    month,
    day,
    week,
    isLeap,
    hours,
    minutes,
    seconds,
    milliseconds,
    amPm,
  };
}
