import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import timezonePlugin from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMounted } from '@mantine/hooks';

dayjs.extend(utc);
dayjs.extend(timezonePlugin);
dayjs.extend(weekOfYear);
dayjs.extend(isLeapYear);

/**
 * Options for configuring the `useClock` hook.
 */
export interface UseClockOptions {
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
export interface ClockData {
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
  /** Whether the clock is currently running and updating. */
  isRunning: boolean;
  /** Function to start the clock. */
  start: () => void;
  /** Function to pause the clock. */
  pause: () => void;
  /** Function to resume the clock. */
  resume: () => void;
  /** Function to reset the clock to its initial state. */
  reset: () => void;
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
  const mounted = useMounted();
  const [time, setTime] = useState<dayjs.Dayjs | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initialEnabledRef = useRef(enabled); // Store initial enabled state - set once

  // Initialize running state based on enabled when mounted
  useEffect(() => {
    if (!mounted) {
      return;
    }

    // Initialize time immediately when mounted, regardless of running state
    setTime(dayjs().tz(timezone));

    if (enabled) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  }, [mounted, enabled, timezone]);

  // Clock update logic
  useEffect(() => {
    if (!mounted || !isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const updateClock = () => {
      setTime(dayjs().tz(timezone));
    };

    updateClock();
    intervalRef.current = setInterval(updateClock, updateFrequency);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [mounted, isRunning, timezone, updateFrequency]);

  // Control functions
  const start = useCallback(() => {
    if (!mounted) {
      return;
    }
    // Update time immediately when starting
    setTime(dayjs().tz(timezone));
    setIsRunning(true);
  }, [mounted, timezone]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    if (!mounted) {
      return;
    }
    // Update time immediately when resuming
    setTime(dayjs().tz(timezone));
    setIsRunning(true);
  }, [mounted, timezone]);

  const reset = useCallback(() => {
    setIsRunning(false);

    // Restore initial enabled state
    if (initialEnabledRef.current) {
      // If initially enabled, restart immediately with current time
      setTime(dayjs().tz(timezone));
      setIsRunning(true);
    } else {
      // If initially disabled, set to current time but stay paused
      setTime(dayjs().tz(timezone));
    }
  }, [timezone]);

  // Return static values when disabled or during SSR
  if (!mounted || !time) {
    const staticHours = padHours ? '00' : 0;
    const staticMinutes = padMinutes ? '00' : 0;
    const staticSeconds = padSeconds ? '00' : 0;

    return {
      year: 2024,
      month: 1,
      day: 1,
      week: 1,
      isLeap: false,
      hours: staticHours,
      minutes: staticMinutes,
      seconds: staticSeconds,
      milliseconds: 0,
      amPm: use24Hours ? undefined : 'AM',
      isRunning: false,
      start: () => {},
      pause: () => {},
      resume: () => {},
      reset: () => {},
    };
  }
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
    isRunning,
    start,
    pause,
    resume,
    reset,
  };
}
