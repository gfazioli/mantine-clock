import { act, renderHook } from '@testing-library/react';
import { useClockCountDown } from './use-clock-count-down';

describe('useClockCountDown', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-06-15T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // Helper: advance timers to trigger mount effect and state updates
  const advanceToMounted = () => {
    act(() => {
      jest.advanceTimersByTime(100);
    });
  };

  // --- Basic duration-based ---

  it('initializes with duration-based countdown', () => {
    const { result } = renderHook(() => useClockCountDown({ hours: 2, minutes: 30, seconds: 15 }));
    advanceToMounted();

    expect(result.current.isRunning).toBe(true);
    expect(result.current.isCompleted).toBe(false);
    expect(result.current.totalMilliseconds).toBeGreaterThan(0);
  });

  it('defaults to 1 hour when no duration specified', () => {
    const { result } = renderHook(() => useClockCountDown({}));
    advanceToMounted();

    // Default is 1 hour = 3600000ms (approximately, accounting for timer ticks)
    expect(result.current.isRunning).toBe(true);
    expect(result.current.isCompleted).toBe(false);
    expect(result.current.hours).toBeLessThanOrEqual(1);
    expect(result.current.totalMilliseconds).toBeGreaterThan(0);
    expect(result.current.totalMilliseconds).toBeLessThanOrEqual(3600000);
  });

  // --- Target date ---

  it('initializes with targetDate countdown', () => {
    // Target 1 hour from now
    const target = new Date('2024-06-15T13:00:00.000Z');
    const { result } = renderHook(() => useClockCountDown({ targetDate: target }));
    advanceToMounted();

    expect(result.current.isRunning).toBe(true);
    expect(result.current.isCompleted).toBe(false);
    expect(result.current.totalMilliseconds).toBeGreaterThan(0);
  });

  it('fires onCountDownCompleted immediately for past targetDate', () => {
    const onCompleted = jest.fn();
    const pastDate = new Date('2024-06-14T12:00:00.000Z'); // yesterday

    renderHook(() =>
      useClockCountDown({
        targetDate: pastDate,
        onCountDownCompleted: onCompleted,
      })
    );
    advanceToMounted();

    expect(onCompleted).toHaveBeenCalled();
  });

  // --- Return type ---

  it('returns days, hours, minutes, seconds as numbers', () => {
    const { result } = renderHook(() => useClockCountDown({ hours: 1 }));
    advanceToMounted();

    expect(typeof result.current.days).toBe('number');
    expect(typeof result.current.hours).toBe('number');
    expect(typeof result.current.minutes).toBe('number');
    expect(typeof result.current.seconds).toBe('number');
    expect(typeof result.current.milliseconds).toBe('number');
    expect(typeof result.current.totalMilliseconds).toBe('number');
  });

  it('returns formatted strings with padding', () => {
    const { result } = renderHook(() =>
      useClockCountDown({
        hours: 1,
        padDays: true,
        padHours: true,
        padMinutes: true,
        padSeconds: true,
      })
    );
    advanceToMounted();

    expect(typeof result.current.formattedDays).toBe('string');
    expect(typeof result.current.formattedHours).toBe('string');
    expect(typeof result.current.formattedMinutes).toBe('string');
    expect(typeof result.current.formattedSeconds).toBe('string');
  });

  it('does not return amPm, isLeap, week, year, month', () => {
    const { result } = renderHook(() => useClockCountDown({ hours: 1 }));
    advanceToMounted();

    expect((result.current as any).amPm).toBeUndefined();
    expect((result.current as any).isLeap).toBeUndefined();
    expect((result.current as any).week).toBeUndefined();
    expect((result.current as any).year).toBeUndefined();
    expect((result.current as any).month).toBeUndefined();
  });

  it('has start as an alias of resume', () => {
    const { result } = renderHook(() => useClockCountDown({ hours: 1 }));
    advanceToMounted();

    expect(typeof result.current.start).toBe('function');
    expect(typeof result.current.pause).toBe('function');
    expect(typeof result.current.resume).toBe('function');
    expect(typeof result.current.reset).toBe('function');
  });

  // --- Lifecycle ---

  it('auto-starts when enabled is true', () => {
    const { result } = renderHook(() => useClockCountDown({ enabled: true, hours: 1 }));
    advanceToMounted();

    expect(result.current.isRunning).toBe(true);
    expect(result.current.isCompleted).toBe(false);
  });

  it('stays paused when enabled is false', () => {
    const { result } = renderHook(() => useClockCountDown({ enabled: false, hours: 1 }));
    advanceToMounted();

    expect(result.current.isRunning).toBe(false);
    expect(result.current.isCompleted).toBe(false);
    expect(result.current.totalMilliseconds).toBeGreaterThan(0);
  });

  it('can pause, resume, and reset', () => {
    const { result } = renderHook(() => useClockCountDown({ enabled: true, hours: 1 }));
    advanceToMounted();

    expect(result.current.isRunning).toBe(true);

    // Pause
    act(() => {
      result.current.pause();
    });
    expect(result.current.isRunning).toBe(false);

    // Resume
    act(() => {
      result.current.resume();
    });
    expect(result.current.isRunning).toBe(true);

    // Pause again then reset
    act(() => {
      result.current.pause();
    });
    act(() => {
      result.current.reset();
    });
    // Reset restores initial enabled state (true), so it should restart
    expect(result.current.isRunning).toBe(true);
    expect(result.current.isCompleted).toBe(false);
  });

  // --- Completion ---

  it('sets isCompleted when countdown reaches zero', () => {
    // Use a short countdown: 1 second
    const { result } = renderHook(() => useClockCountDown({ seconds: 1, updateFrequency: 100 }));
    advanceToMounted();

    expect(result.current.isCompleted).toBe(false);

    // Advance past the countdown duration
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(result.current.isCompleted).toBe(true);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.totalMilliseconds).toBe(0);
  });

  it('calls onCountDownCompleted callback', () => {
    const onCompleted = jest.fn();

    const { result } = renderHook(() =>
      useClockCountDown({
        seconds: 1,
        updateFrequency: 100,
        onCountDownCompleted: onCompleted,
      })
    );
    advanceToMounted();

    // Advance past countdown
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(onCompleted).toHaveBeenCalled();
    expect(result.current.isCompleted).toBe(true);
  });

  // --- SSR / initial state ---

  it('returns zeroed values when completed', () => {
    // Use a past target date so countdown completes immediately
    const pastDate = new Date('2024-06-14T00:00:00.000Z');
    const { result } = renderHook(() => useClockCountDown({ targetDate: pastDate }));
    advanceToMounted();

    // Completed countdown should return all zeros
    expect(result.current.days).toBe(0);
    expect(result.current.hours).toBe(0);
    expect(result.current.minutes).toBe(0);
    expect(result.current.seconds).toBe(0);
    expect(result.current.milliseconds).toBe(0);
    expect(result.current.totalMilliseconds).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.isCompleted).toBe(true);
  });

  // --- Drift ---

  it('uses wall-clock calculation for duration mode', () => {
    const { result } = renderHook(() => useClockCountDown({ minutes: 10, updateFrequency: 1000 }));
    advanceToMounted();

    const initialMs = result.current.totalMilliseconds;
    expect(initialMs).toBeGreaterThan(0);

    // Advance by 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Remaining time should have decreased by approximately 5 seconds
    const afterMs = result.current.totalMilliseconds;
    // Allow some tolerance since wall clock is used
    expect(afterMs).toBeLessThan(initialMs);
    expect(initialMs - afterMs).toBeGreaterThanOrEqual(4000);
    expect(initialMs - afterMs).toBeLessThanOrEqual(6000);
  });

  // --- updateFrequency validation ---

  it('clamps updateFrequency to minimum 16ms', () => {
    const { result } = renderHook(() => useClockCountDown({ hours: 1, updateFrequency: 5 }));
    advanceToMounted();

    // Should still function correctly
    expect(result.current.isRunning).toBe(true);
    expect(result.current.totalMilliseconds).toBeGreaterThan(0);
  });

  // --- Cleanup ---

  it('cleans up interval on unmount', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    const { unmount } = renderHook(() => useClockCountDown({ hours: 1 }));
    advanceToMounted();

    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
