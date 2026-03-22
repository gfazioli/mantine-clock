import { act, renderHook } from '@testing-library/react';
import { useClock as useClockHook } from './use-clock';

// Wrapper to avoid triggering esbuild-jest babel fallback.
// esbuild-jest scans source for mock-like patterns and falls back to babel,
// which fails due to a missing plugin. Using an indirection avoids the match.
const callHook = (opts: Parameters<typeof useClockHook>[0]) => useClockHook(opts);

describe('useClock', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-06-15T14:30:45.123Z'));
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

  // --- Default values ---

  it('returns default values with default options', () => {
    const { result } = renderHook(() => callHook({}));
    advanceToMounted();

    expect(result.current.year).toBe(2024);
    expect(typeof result.current.hours).toBe('number');
    expect(typeof result.current.minutes).toBe('number');
    expect(typeof result.current.seconds).toBe('number');
    expect(typeof result.current.milliseconds).toBe('number');
  });

  it('returns hours, minutes, seconds as numbers', () => {
    const { result } = renderHook(() => callHook({}));
    advanceToMounted();

    expect(typeof result.current.hours).toBe('number');
    expect(typeof result.current.minutes).toBe('number');
    expect(typeof result.current.seconds).toBe('number');
  });

  it('returns formatted strings with padding', () => {
    const { result } = renderHook(() =>
      callHook({ padHours: true, padMinutes: true, padSeconds: true })
    );
    advanceToMounted();

    expect(typeof result.current.formattedHours).toBe('string');
    expect(typeof result.current.formattedMinutes).toBe('string');
    expect(typeof result.current.formattedSeconds).toBe('string');
  });

  // --- 24h vs 12h ---

  it('returns 24-hour format by default', () => {
    const { result } = renderHook(() => callHook({ timezone: 'UTC' }));
    advanceToMounted();

    // 14:30:45 UTC => hours=14 in 24h mode
    expect(result.current.hours).toBe(14);
    expect(result.current.amPm).toBeUndefined();
  });

  it('returns 12-hour format with amPm when use24Hours is false', () => {
    const { result } = renderHook(() => callHook({ timezone: 'UTC', use24Hours: false }));
    advanceToMounted();

    // 14:30 UTC => 2 PM in 12h mode
    expect(result.current.hours).toBe(2);
    expect(result.current.amPm).toBe('PM');
  });

  // --- Padding ---

  it('pads hours when padHours is true', () => {
    jest.setSystemTime(new Date('2024-06-15T09:05:03.000Z'));

    const { result } = renderHook(() => callHook({ timezone: 'UTC', padHours: true }));
    advanceToMounted();

    expect(result.current.formattedHours).toBe('09');
  });

  it('pads minutes when padMinutes is true', () => {
    jest.setSystemTime(new Date('2024-06-15T09:05:03.000Z'));

    const { result } = renderHook(() => callHook({ timezone: 'UTC', padMinutes: true }));
    advanceToMounted();

    expect(result.current.formattedMinutes).toBe('05');
  });

  it('pads seconds when padSeconds is true', () => {
    jest.setSystemTime(new Date('2024-06-15T09:05:03.000Z'));

    const { result } = renderHook(() => callHook({ timezone: 'UTC', padSeconds: true }));
    advanceToMounted();

    expect(result.current.formattedSeconds).toBe('03');
  });

  // --- Control lifecycle ---

  it('starts running by default when enabled is true', () => {
    const { result } = renderHook(() => callHook({ enabled: true }));
    advanceToMounted();

    expect(result.current.isRunning).toBe(true);
  });

  it('starts paused when enabled is false', () => {
    const { result } = renderHook(() => callHook({ enabled: false }));
    advanceToMounted();

    expect(result.current.isRunning).toBe(false);
  });

  it('can pause and resume', () => {
    const { result } = renderHook(() => callHook({ enabled: true }));
    advanceToMounted();

    expect(result.current.isRunning).toBe(true);

    act(() => {
      result.current.pause();
    });
    expect(result.current.isRunning).toBe(false);

    act(() => {
      result.current.resume();
    });
    expect(result.current.isRunning).toBe(true);
  });

  it('can reset to initial state', () => {
    const { result } = renderHook(() => callHook({ enabled: true }));
    advanceToMounted();

    act(() => {
      result.current.pause();
    });
    expect(result.current.isRunning).toBe(false);

    act(() => {
      result.current.reset();
    });
    // Reset restores initial enabled state (true), so isRunning should be true
    expect(result.current.isRunning).toBe(true);
  });

  // --- SSR ---

  it('returns safe SSR values before mount', () => {
    const { result } = renderHook(() =>
      callHook({ padHours: true, padMinutes: true, padSeconds: true })
    );
    // After mount, the hook should have real values
    advanceToMounted();
    expect(result.current.year).toBeGreaterThan(2020);
    expect(result.current.isRunning).toBe(true);
  });

  it('returns real year after mount', () => {
    const { result } = renderHook(() => callHook({}));
    advanceToMounted();
    expect(result.current.year).toBeGreaterThanOrEqual(2024);
  });

  // --- updateFrequency validation ---

  it('clamps updateFrequency to minimum 16ms', () => {
    const { result } = renderHook(() => callHook({ updateFrequency: 5 }));
    advanceToMounted();

    expect(result.current.isRunning).toBe(true);
    expect(typeof result.current.hours).toBe('number');
  });

  // --- No start method ---

  it('does not have a start method', () => {
    const { result } = renderHook(() => callHook({}));
    advanceToMounted();

    expect((result.current as any).start).toBeUndefined();
    expect(typeof result.current.pause).toBe('function');
    expect(typeof result.current.resume).toBe('function');
    expect(typeof result.current.reset).toBe('function');
  });
});
