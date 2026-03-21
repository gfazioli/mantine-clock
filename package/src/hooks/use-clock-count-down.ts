import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import timezonePlugin from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMounted } from '@mantine/hooks';

dayjs.extend(utc);
dayjs.extend(timezonePlugin);
dayjs.extend(duration);

/**
 * Options for configuring the `useClockCountDown` hook.
 */
export interface UseClockCountDownOptions {
  /** Whether the countdown is active and updating. */
  enabled?: boolean;
  /** The timezone to use for the countdown calculations. */
  timezone?: string;
  /** The frequency (in milliseconds) at which the countdown updates. Minimum 16ms. */
  updateFrequency?: number;
  /** Whether to pad single-digit seconds with a leading zero. */
  padSeconds?: boolean;
  /** Whether to pad single-digit minutes with a leading zero. */
  padMinutes?: boolean;
  /** Whether to pad single-digit hours with a leading zero. */
  padHours?: boolean;
  /** Whether to pad single-digit days with a leading zero. */
  padDays?: boolean;
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
  /** The remaining days. */
  days: number;
  /** The remaining hours. */
  hours: number;
  /** The remaining minutes. */
  minutes: number;
  /** The remaining seconds. */
  seconds: number;
  /** The remaining milliseconds. */
  milliseconds: number;
  /** Total remaining time in milliseconds. */
  totalMilliseconds: number;
  /** Whether the countdown has completed (reached zero). */
  isCompleted: boolean;
  /** Whether the countdown is currently running. */
  isRunning: boolean;
  /** The formatted days string (with padding if enabled). */
  formattedDays: string;
  /** The formatted hours string (with padding if enabled). */
  formattedHours: string;
  /** The formatted minutes string (with padding if enabled). */
  formattedMinutes: string;
  /** The formatted seconds string (with padding if enabled). */
  formattedSeconds: string;
  /** Pause/stop the countdown */
  pause: () => void;
  /** Resume the countdown from current position */
  resume: () => void;
  /** Reset the countdown to initial values */
  reset: () => void;
}

/**
 * `useClockCountDown` is a React hook that provides real-time countdown data.
 *
 * This hook allows you to create a countdown timer to a specific date or time duration.
 * You can specify either a target date or a duration (hours, minutes, seconds) from the current time.
 * The hook returns an object containing detailed countdown information and supports timezone
 * and update frequency options.
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
  padSeconds = false,
  padMinutes = false,
  padHours = false,
  padDays = false,
  targetDate,
  hours = 0,
  minutes = 0,
  seconds = 0,
  onCountDownCompleted,
}: UseClockCountDownOptions): ClockCountDownData {
  const mounted = useMounted();

  // Clamp updateFrequency to minimum 16ms
  const effectiveUpdateFrequency = Math.max(16, updateFrequency);

  // State
  const [remainingTime, setRemainingTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initialDurationRef = useRef(0);
  const targetDateRef = useRef<dayjs.Dayjs | null>(null);
  const wallClockStartRef = useRef<number>(0);
  const completedCallbackRef = useRef(onCountDownCompleted);
  const initialEnabledRef = useRef(enabled); // Store initial enabled state - set once

  // Update callback ref when it changes
  useEffect(() => {
    completedCallbackRef.current = onCountDownCompleted;
  }, [onCountDownCompleted]);

  // Calculate initial duration
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

    const dur = calculateInitialDuration();
    initialDurationRef.current = dur;
    setRemainingTime(dur);

    if (dur <= 0) {
      setIsCompleted(true);
      setIsRunning(false);
      // Fire callback immediately if target is already in the past (A8)
      if (completedCallbackRef.current) {
        completedCallbackRef.current();
      }
    } else if (enabled) {
      setIsCompleted(false);
      wallClockStartRef.current = Date.now();
      setIsRunning(true);
    } else {
      setIsCompleted(false);
      setIsRunning(false);
    }
  }, [mounted, calculateInitialDuration, enabled]);

  // Timer logic - drift-free
  useEffect(() => {
    if (!mounted || !isRunning || isCompleted) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const tick = () => {
      let newTime: number;

      if (targetDate) {
        // For targetDate mode: recalculate from target each tick (drift-free)
        const now = dayjs().tz(timezone);
        newTime = Math.max(0, targetDateRef.current!.diff(now));
      } else {
        // For duration mode: compute from wall clock start (drift-free)
        const elapsed = Date.now() - wallClockStartRef.current;
        newTime = Math.max(0, initialDurationRef.current - elapsed);
      }

      setRemainingTime(newTime);

      if (newTime <= 0) {
        setIsCompleted(true);
        setIsRunning(false);

        if (completedCallbackRef.current) {
          completedCallbackRef.current();
        }
      }
    };

    intervalRef.current = setInterval(tick, effectiveUpdateFrequency);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [mounted, isRunning, isCompleted, effectiveUpdateFrequency, targetDate, timezone]);

  // Control functions
  const pause = useCallback(() => {
    setIsRunning(false);
    // For duration mode, save remaining so we can resume from it
    if (!targetDate) {
      const elapsed = Date.now() - wallClockStartRef.current;
      const remaining = Math.max(0, initialDurationRef.current - elapsed);
      initialDurationRef.current = remaining;
    }
  }, [targetDate]);

  const resume = useCallback(() => {
    if (!mounted || isCompleted || remainingTime <= 0) {
      return;
    }
    if (!targetDate) {
      // Reset wall clock start for duration mode
      wallClockStartRef.current = Date.now();
    }
    setIsRunning(true);
  }, [mounted, isCompleted, remainingTime, targetDate]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setIsCompleted(false);
    const dur = calculateInitialDuration();
    initialDurationRef.current = dur;
    setRemainingTime(dur);
    wallClockStartRef.current = Date.now();

    // Restore initial enabled state
    if (initialEnabledRef.current && dur > 0) {
      setIsRunning(true);
    }
  }, [calculateInitialDuration]);

  // Helper to build zeroed return value
  const buildZeroResult = (completed: boolean, running: boolean): ClockCountDownData => ({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
    totalMilliseconds: 0,
    isCompleted: completed,
    isRunning: running,
    formattedDays: padDays ? '00' : '0',
    formattedHours: padHours ? '00' : '0',
    formattedMinutes: padMinutes ? '00' : '0',
    formattedSeconds: padSeconds ? '00' : '0',
    pause: completed ? () => {} : pause,
    resume: completed ? () => {} : resume,
    reset: completed ? reset : reset,
  });

  // Return static values during SSR
  if (!mounted) {
    return buildZeroResult(false, false);
  }

  // Handle completed state
  if (isCompleted || remainingTime <= 0) {
    return buildZeroResult(true, false);
  }

  // Calculate time components from remaining time
  const dur = dayjs.duration(remainingTime);
  const remainingDays = Math.floor(dur.asDays());
  const remainingHours = Math.floor(dur.asHours()) % 24;
  const remainingMinutes = dur.minutes();
  const remainingSecondsCount = dur.seconds();
  const remainingMilliseconds = dur.milliseconds();

  const formattedDays = padDays
    ? remainingDays.toString().padStart(2, '0')
    : remainingDays.toString();
  const formattedHours = padHours
    ? remainingHours.toString().padStart(2, '0')
    : remainingHours.toString();
  const formattedMinutes = padMinutes
    ? remainingMinutes.toString().padStart(2, '0')
    : remainingMinutes.toString();
  const formattedSeconds = padSeconds
    ? remainingSecondsCount.toString().padStart(2, '0')
    : remainingSecondsCount.toString();

  return {
    days: remainingDays,
    hours: remainingHours,
    minutes: remainingMinutes,
    seconds: remainingSecondsCount,
    milliseconds: remainingMilliseconds,
    totalMilliseconds: remainingTime,
    isCompleted: false,
    isRunning,
    formattedDays,
    formattedHours,
    formattedMinutes,
    formattedSeconds,
    pause,
    resume,
    reset,
  };
}
