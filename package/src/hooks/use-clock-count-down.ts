import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
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
dayjs.extend(duration);

dayjs.extend(utc);
dayjs.extend(timezonePlugin);
dayjs.extend(weekOfYear);
dayjs.extend(isLeapYear);
dayjs.extend(duration);

/**
 * Options for configuring the `useClockCountDown` hook.
 */
export interface UseClockCountDownOptions {
  /** Whether the countdown is active and updating. */
  enabled?: boolean;
  /** The timezone to use for the countdown calculations. */
  timezone?: string;
  /** The frequency (in milliseconds) at which the countdown updates. */
  updateFrequency?: number;
  /** Whether to use 24-hour format or 12-hour format. */
  use24Hours?: boolean;
  /** Whether to pad single-digit seconds with a leading zero. */
  padSeconds?: boolean;
  /** Whether to pad single-digit minutes with a leading zero. */
  padMinutes?: boolean;
  /** Whether to pad single-digit hours with a leading zero. */
  padHours?: boolean;
  /** Target date for the countdown (Date object or ISO string). */
  targetDate?: Date | string;
  /** Number of hours to count down from current time. */
  hours?: number;
  /** Number of minutes to count down from current time. */
  minutes?: number;
  /** Number of seconds to count down from current time. */
  seconds?: number;
  /** Callback function called when countdown reaches zero. */
  onCountDownCompleted?: () => void;
}

/**
 * Data returned by the `useClockCountDown` hook.
 */
export interface ClockCountDownData {
  /** The remaining years. */
  year: number;
  /** The remaining months (1-12). */
  month: number;
  /** The remaining days. */
  day: number;
  /** The remaining weeks. */
  week: number;
  /** Whether the current year is a leap year (based on target date). */
  isLeap: boolean;
  /** The remaining hours (adjusted for 12/24-hour format). */
  hours: number | string;
  /** The remaining minutes. */
  minutes: number | string;
  /** The remaining seconds. */
  seconds: number | string;
  /** The remaining milliseconds. */
  milliseconds: number;
  /** Whether the time is AM or PM (only relevant if use24Hours is false). */
  amPm?: 'AM' | 'PM';
  /** Whether the countdown has completed (reached zero). */
  isCompleted: boolean;
  /** Whether the countdown is currently running. */
  isRunning: boolean;
  /** Total remaining time in milliseconds. */
  totalMilliseconds: number;
  /** Start the countdown */
  start: () => void;
  /** Pause/stop the countdown */
  pause: () => void;
  /** Reset the countdown to initial values */
  reset: () => void;
  /** Resume the countdown from current position */
  resume: () => void;
}

/**
 * `useClockCountDown` is a React hook that provides real-time countdown data.
 *
 * This hook allows you to create a countdown timer to a specific date or time duration.
 * You can specify either a target date or a duration (hours, minutes, seconds) from the current time.
 * The hook returns an object containing detailed countdown information and supports timezone,
 * update frequency, and 12/24-hour format options.
 *
 * @param {UseClockCountDownOptions} options - Configuration options for the countdown.
 * @returns {ClockCountDownData} An object containing the current countdown data.
 *
 * @example
 * // Countdown to a specific date
 * const { hours, minutes, seconds, isCompleted } = useClockCountDown({
 *   targetDate: '2024-12-31T23:59:59Z',
 *   timezone: 'America/New_York',
 *   onCountDownCompleted: () => console.log('Happy New Year!'),
 * });
 *
 * @example
 * // Countdown for 12 hours from now
 * const { hours, minutes, seconds } = useClockCountDown({
 *   hours: 12,
 *   updateFrequency: 1000,
 *   use24Hours: false,
 * });
 *
 * @example
 * // Countdown for 30 minutes and 45 seconds
 * const countdown = useClockCountDown({
 *   minutes: 30,
 *   seconds: 45,
 *   padHours: true,
 *   padMinutes: true,
 *   padSeconds: true,
 * });
 */
export function useClockCountDown({
  enabled = true,
  timezone = 'UTC',
  updateFrequency = 1000,
  use24Hours = true,
  padSeconds = false,
  padMinutes = false,
  padHours = false,
  targetDate,
  hours = 0,
  minutes = 0,
  seconds = 0,
  onCountDownCompleted,
}: UseClockCountDownOptions): ClockCountDownData {
  const mounted = useMounted();

  // State
  const [remainingTime, setRemainingTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initialDurationRef = useRef(0);
  const targetDateRef = useRef<dayjs.Dayjs | null>(null);
  const completedCallbackRef = useRef(onCountDownCompleted);
  const initialEnabledRef = useRef(enabled); // Store initial enabled state - set once

  // Update callback ref when it changes
  useEffect(() => {
    completedCallbackRef.current = onCountDownCompleted;
  }, [onCountDownCompleted]); // Calculate initial duration
  const calculateInitialDuration = useCallback(() => {
    if (!mounted) {
      return 0;
    }

    let target: dayjs.Dayjs;

    if (targetDate) {
      target = dayjs(targetDate).tz(timezone);
    } else {
      const now = dayjs().tz(timezone);
      const h = Math.max(0, hours);
      const m = Math.max(0, minutes);
      const s = Math.max(0, seconds);

      if (h === 0 && m === 0 && s === 0) {
        // Default to 1 hour if no duration specified
        target = now.add(1, 'hour');
      } else {
        target = now.add(h, 'hour').add(m, 'minute').add(s, 'second');
      }
    }

    targetDateRef.current = target;
    const now = dayjs().tz(timezone);
    return Math.max(0, target.diff(now));
  }, [targetDate, hours, minutes, seconds, timezone, mounted]);

  // Initialize duration when parameters change
  useEffect(() => {
    if (!mounted) {
      return;
    }

    const duration = calculateInitialDuration();
    initialDurationRef.current = duration;
    setRemainingTime(duration);
    setIsCompleted(duration <= 0);

    // Auto-start if enabled
    if (enabled && duration > 0) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  }, [mounted, calculateInitialDuration, enabled]);

  // Timer logic
  useEffect(() => {
    if (!mounted || !isRunning || isCompleted) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = Math.max(0, prev - updateFrequency);

        if (newTime <= 0) {
          setIsCompleted(true);
          setIsRunning(false);

          // Call completion callback
          if (completedCallbackRef.current) {
            completedCallbackRef.current();
          }
        }

        return newTime;
      });
    }, updateFrequency);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [mounted, isRunning, isCompleted, updateFrequency]);

  // Control functions
  const start = useCallback(() => {
    if (!mounted || isCompleted) {
      return;
    }
    setIsRunning(true);
  }, [mounted, isCompleted]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    if (!mounted || isCompleted || remainingTime <= 0) {
      return;
    }
    setIsRunning(true);
  }, [mounted, isCompleted, remainingTime]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setIsCompleted(false);
    const duration = calculateInitialDuration();
    initialDurationRef.current = duration;
    setRemainingTime(duration);

    // Restore initial enabled state
    if (initialEnabledRef.current && duration > 0) {
      setIsRunning(true);
    }
  }, [calculateInitialDuration]);

  // Return static values during SSR
  if (!mounted) {
    const staticHours = padHours ? '00' : 0;
    const staticMinutes = padMinutes ? '00' : 0;
    const staticSeconds = padSeconds ? '00' : 0;

    return {
      year: 0,
      month: 1,
      day: 0,
      week: 0,
      isLeap: false,
      hours: staticHours,
      minutes: staticMinutes,
      seconds: staticSeconds,
      milliseconds: 0,
      amPm: use24Hours ? undefined : 'AM',
      isCompleted: false,
      isRunning: false,
      totalMilliseconds: 0,
      start: () => {},
      pause: () => {},
      reset: () => {},
      resume: () => {},
    };
  }

  // Handle completed state
  if (isCompleted || remainingTime <= 0) {
    const staticHours = padHours ? '00' : 0;
    const staticMinutes = padMinutes ? '00' : 0;
    const staticSeconds = padSeconds ? '00' : 0;

    return {
      year: 0,
      month: 0,
      day: 0,
      week: 0,
      isLeap: false,
      hours: staticHours,
      minutes: staticMinutes,
      seconds: staticSeconds,
      milliseconds: 0,
      amPm: use24Hours ? undefined : 'AM',
      isCompleted: true,
      isRunning: false,
      totalMilliseconds: 0,
      start: () => {},
      pause,
      reset,
      resume: () => {},
    };
  }

  // Calculate time components from remaining time
  const dur = dayjs.duration(remainingTime);
  const remainingYears = Math.floor(dur.asYears());
  const remainingMonths = Math.floor(dur.asMonths()) % 12;
  const remainingDays = Math.floor(dur.asDays()) % 365;
  const remainingWeeks = Math.floor(dur.asWeeks());

  let remainingHours: number | string = Math.floor(dur.asHours()) % 24;
  let remainingMinutes: number | string = dur.minutes();
  let remainingSecondsCount: number | string = dur.seconds();
  const remainingMilliseconds = dur.milliseconds();

  let amPm: 'AM' | 'PM' | undefined;
  if (!use24Hours) {
    amPm = remainingHours >= 12 ? 'PM' : 'AM';
    remainingHours = remainingHours % 12 || 12;
  }

  if (padHours) {
    remainingHours = remainingHours.toString().padStart(2, '0');
  }
  if (padMinutes) {
    remainingMinutes = remainingMinutes.toString().padStart(2, '0');
  }
  if (padSeconds) {
    remainingSecondsCount = remainingSecondsCount.toString().padStart(2, '0');
  }

  const isLeap = targetDateRef.current ? targetDateRef.current.isLeapYear() : false;

  return {
    year: remainingYears,
    month: remainingMonths + 1,
    day: remainingDays,
    week: remainingWeeks,
    isLeap,
    hours: remainingHours,
    minutes: remainingMinutes,
    seconds: remainingSecondsCount,
    milliseconds: remainingMilliseconds,
    amPm,
    isCompleted: false,
    isRunning,
    totalMilliseconds: remainingTime,
    start,
    pause,
    reset,
    resume,
  };
}
