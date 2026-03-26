import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  BoxProps,
  createVarsResolver,
  Factory,
  factory,
  getSize,
  MantineColor,
  MantineSize,
  parseThemeColor,
  px,
  StylesApiProps,
  TextProps,
  useMatches,
  useProps,
  useStyles,
  type StyleProp,
} from '@mantine/core';
import { useCallbackRef, useMergedRef } from '@mantine/hooks';
import { defaultClockProps, parseTimeValue, round2 } from './clock-utils';
import { ClockDigital } from './ClockDigital';
import { ClockFaceStatic } from './ClockFaceStatic';
import { createGeometry } from './geometry';
import { RealClock } from './RealClock';
import classes from './Clock.module.css';

// Extend dayjs with timezone support
dayjs.extend(utc);
dayjs.extend(timezone);

// Common timezone strings for better IntelliSense
export type Timezone =
  | 'UTC'
  | 'America/New_York'
  | 'America/Los_Angeles'
  | 'America/Chicago'
  | 'America/Denver'
  | 'America/Toronto'
  | 'America/Vancouver'
  | 'America/Sao_Paulo'
  | 'America/Mexico_City'
  | 'Europe/London'
  | 'Europe/Berlin'
  | 'Europe/Paris'
  | 'Europe/Rome'
  | 'Europe/Madrid'
  | 'Europe/Amsterdam'
  | 'Europe/Stockholm'
  | 'Europe/Moscow'
  | 'Asia/Tokyo'
  | 'Asia/Shanghai'
  | 'Asia/Singapore'
  | 'Asia/Hong_Kong'
  | 'Asia/Seoul'
  | 'Asia/Kolkata'
  | 'Asia/Dubai'
  | 'Australia/Sydney'
  | 'Australia/Melbourne'
  | 'Pacific/Auckland'
  | string; // Allow any timezone string

export type ClockStylesNames =
  | 'root'
  | 'clockContainer'
  | 'glassWrapper'
  | 'clockFace'
  | 'faceContent'
  | 'hourMarks'
  | 'hourTick'
  | 'minuteTick'
  | 'number'
  | 'primaryNumber'
  | 'secondaryNumber'
  | 'arcsLayer'
  | 'hand'
  | 'hourHand'
  | 'minuteHand'
  | 'secondHandContainer'
  | 'secondHand'
  | 'secondHandCounterweight'
  | 'centerBlur'
  | 'centerDot';

export type ClockCssVariables = {
  root:
    | '--clock-size'
    | '--clock-color'
    | '--clock-hour-ticks-color'
    | '--clock-hour-ticks-opacity'
    | '--clock-minute-ticks-color'
    | '--clock-minute-ticks-opacity'
    | '--clock-second-hand-color'
    | '--clock-minute-hand-color'
    | '--clock-hour-hand-color'
    | '--clock-seconds-arc-color'
    | '--clock-minutes-arc-color'
    | '--clock-hours-arc-color'
    | '--clock-primary-numbers-color'
    | '--clock-primary-numbers-opacity'
    | '--clock-secondary-numbers-color'
    | '--clock-secondary-numbers-opacity';
};

export interface ClockBaseProps {
  /** Color of the clock face (MantineColor or CSS color) */
  color?: MantineColor;

  /** Mantine color for the hour ticks */
  hourTicksColor?: MantineColor;

  /** Opacity for the hour ticks (0 = hidden, 1 = fully visible) */
  hourTicksOpacity?: number;

  /** Mantine color for the minute ticks */
  minuteTicksColor?: MantineColor;

  /** Opacity for the minute ticks (0 = hidden, 1 = fully visible) */
  minuteTicksOpacity?: number;

  /** Mantine color for the primary hour numbers (12, 3, 6, 9) */
  primaryNumbersColor?: MantineColor;

  /** Opacity for the primary hour numbers (0 = hidden, 1 = fully visible) */
  primaryNumbersOpacity?: number;

  /** Mantine color for the secondary hour numbers (1, 2, 4, 5, 7, 8, 10, 11) */
  secondaryNumbersColor?: MantineColor;

  /** Opacity for the secondary hour numbers (0 = hidden, 1 = fully visible) */
  secondaryNumbersOpacity?: number;

  /** Second hand movement behavior */
  secondHandBehavior?: 'tick' | 'smooth' | 'tick-half' | 'tick-high-freq';

  /** Mantine color for the seconds hand */
  secondHandColor?: MantineColor;

  /** Opacity for the seconds hand (0 = hidden, 1 = fully visible) */
  secondHandOpacity?: number;

  /** Length of the second hand as a percentage of clock radius (0.2 to 0.8) */
  secondHandLength?: number;

  /** Thickness of the second hand as a percentage of clock size (0.005 to 0.05) */
  secondHandSize?: number;

  /** Mantine color for the minutes hand */
  minuteHandColor?: MantineColor;

  /** Opacity for the minutes hand (0 = hidden, 1 = fully visible) */
  minuteHandOpacity?: number;

  /** Thickness of the minute hand as a percentage of clock size (0.01 to 0.1) */
  minuteHandSize?: number;

  /** Length of the minute hand as a percentage of clock radius (0.2 to 0.8) */
  minuteHandLength?: number;

  /** Size of the clock in pixels (default: 400px). Supports responsive values via breakpoint objects (e.g., `{ base: 200, md: 400 }`) */
  size?: StyleProp<MantineSize | number | (string & {})>;

  /** Thickness of the hour hand as a percentage of clock size (0.01 to 0.1) */
  hourHandSize?: number;

  /** Length of the hour hand as a percentage of clock radius (0.2 to 0.8) */
  hourHandLength?: number;

  /** Mantine color for the hours hand */
  hourHandColor?: MantineColor;

  /** Opacity for the hours hand (0 = hidden, 1 = fully visible) */
  hourHandOpacity?: number;

  /** Distance of the hour numbers from the center as a percentage of the radius (0.5 = 50%, 0.83 = default) */
  hourNumbersDistance?: number;

  /** Props for primary hour numbers (12, 3, 6, 9) Text component */
  primaryNumbersProps?: TextProps;

  /** Props for secondary hour numbers (1, 2, 4, 5, 7, 8, 10, 11) Text component */
  secondaryNumbersProps?: TextProps;

  /** Timezone for displaying time in different countries (e.g., 'America/New_York', 'Europe/London', 'Asia/Tokyo') */
  timezone?: Timezone;

  /** Whether the clock should update in real time (default: `true`) */
  running?: boolean;

  /** Time value to display. Can be a string ("10:30", "18:15:07"), Date, or dayjs object. When running=true, this sets the starting time. When running=false and no value is provided, displays the current time. */
  value?: string | Date | dayjs.Dayjs;

  /** Custom aria-label for the clock. If not provided, a default label with the current time will be used. */
  ariaLabel?: string;

  /** Shape of the clock face (default: 'circle') */
  shape?: 'circle' | 'rounded-rect';

  /** Aspect ratio for rounded-rect shape (default: 1, range: 0.6-1.5). Values > 1 = taller, < 1 = wider */
  aspectRatio?: number;

  /** Border radius in pixels for rounded-rect shape. Default: 20% of shorter side */
  borderRadius?: number;

  /** Callback fired on each time update with the current time data */
  onTimeChange?: (time: {
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
  }) => void;

  /** Custom render function for the hour hand */
  renderHourHand?: (props: HandRenderProps) => React.ReactNode;

  /** Custom render function for the minute hand */
  renderMinuteHand?: (props: HandRenderProps) => React.ReactNode;

  /** Custom render function for the second hand (including counterweight) */
  renderSecondHand?: (props: HandRenderProps) => React.ReactNode;

  /** Array of time sectors to display on the clock face */
  sectors?: ClockSector[];

  /** Custom content rendered on the clock face, between the background and ticks/hands */
  faceContent?: React.ReactNode;

  /** Animate hands from 12:00 to current time on mount (default: false) */
  animateOnMount?: boolean;

  /** Duration of mount animation in ms (default: 1000) */
  animateOnMountDuration?: number;
}

export interface HandRenderProps {
  /** Rotation angle in degrees (0 = 12 o'clock) */
  angle: number;
  /** Hand length in pixels */
  length: number;
  /** Hand width/thickness in pixels */
  width: number;
  /** Center X coordinate */
  centerX: number;
  /** Center Y coordinate */
  centerY: number;
  /** Total clock size in pixels */
  clockSize: number;
}

export interface ClockSector {
  /** Start time (e.g., "09:00" or "09:00:00") */
  from: string;
  /** End time (e.g., "10:30") */
  to: string;
  /** Sector color (CSS color string, e.g., "#ff0000", "rgb(255,0,0)") */
  color?: string;
  /** Sector opacity (0-1) */
  opacity?: number;
  /** Label for tooltip/accessibility */
  label?: string;
  /** Enable click/hover interactivity */
  interactive?: boolean;
  /** Click handler */
  onClick?: (sector: ClockSector) => void;
  /** Hover handler */
  onHover?: (sector: ClockSector, entering: boolean) => void;
}

export interface ClockArcsProps {
  /** Toggle seconds arc visibility (preferred) */
  withSecondsArc?: boolean;
  /** Start time for seconds arc (e.g., "12:00:00") */
  secondsArcFrom?: string | Date;
  /** Direction for seconds arc */
  secondsArcDirection?: 'clockwise' | 'counterClockwise';
  /** Color for seconds arc */
  secondsArcColor?: MantineColor;
  /** Opacity for seconds arc (0 = hidden, 1 = fully visible) */
  secondsArcOpacity?: number;

  /** Toggle minutes arc visibility (preferred) */
  withMinutesArc?: boolean;
  /** Start time for minutes arc (e.g., "12:00") */
  minutesArcFrom?: string | Date;
  /** Direction for minutes arc */
  minutesArcDirection?: 'clockwise' | 'counterClockwise';
  /** Color for minutes arc */
  minutesArcColor?: MantineColor;
  /** Opacity for minutes arc (0 = hidden, 1 = fully visible) */
  minutesArcOpacity?: number;

  /** Toggle hours arc visibility (preferred) */
  withHoursArc?: boolean;
  /** Start time for hours arc (e.g., "12:00") */
  hoursArcFrom?: string | Date;
  /** Direction for hours arc */
  hoursArcDirection?: 'clockwise' | 'counterClockwise';
  /** Color for hours arc */
  hoursArcColor?: MantineColor;
  /** Opacity for hours arc (0 = hidden, 1 = fully visible) */
  hoursArcOpacity?: number;
}

export interface ClockProps
  extends BoxProps, ClockBaseProps, ClockArcsProps, StylesApiProps<ClockFactory> {}

export type ClockFactory = Factory<{
  props: ClockProps;
  ref: HTMLDivElement;
  stylesNames: ClockStylesNames;
  vars: ClockCssVariables;
  staticComponents: {
    Digital: typeof ClockDigital;
  };
}>;

export const defaultProps: Partial<ClockProps> = defaultClockProps;

const defaultClockSizes = {
  xs: 100,
  sm: 200,
  md: 400,
  lg: 480,
  xl: 512,
};

const varsResolver = createVarsResolver<ClockFactory>((theme, props) => {
  const c = (color: string) => parseThemeColor({ color, theme }).value;
  return {
    root: {
      '--clock-size': undefined as unknown as string,
      '--clock-color': c(props.color || ''),
      '--clock-hour-ticks-color': c(props.hourTicksColor || ''),
      '--clock-hour-ticks-opacity': round2(props.hourTicksOpacity ?? 1).toString(),
      '--clock-minute-ticks-color': c(props.minuteTicksColor || ''),
      '--clock-minute-ticks-opacity': round2(props.minuteTicksOpacity ?? 1).toString(),
      '--clock-primary-numbers-color': c(props.primaryNumbersColor || ''),
      '--clock-primary-numbers-opacity': round2(props.primaryNumbersOpacity ?? 1).toString(),
      '--clock-secondary-numbers-color': c(props.secondaryNumbersColor || ''),
      '--clock-secondary-numbers-opacity': round2(props.secondaryNumbersOpacity ?? 1).toString(),
      '--clock-second-hand-color': c(props.secondHandColor || ''),
      '--clock-minute-hand-color': c(props.minuteHandColor || ''),
      '--clock-hour-hand-color': c(props.hourHandColor || ''),
      '--clock-seconds-arc-color': c(props.secondsArcColor || props.secondHandColor || ''),
      '--clock-minutes-arc-color': c(props.minutesArcColor || props.minuteHandColor || ''),
      '--clock-hours-arc-color': c(props.hoursArcColor || props.hourHandColor || ''),
    },
  };
});

export const Clock = factory<ClockFactory>((_props, ref) => {
  const props = useProps('Clock', defaultProps, _props);
  const [time, setTime] = useState(new Date());
  const [hasMounted, setHasMounted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const realStartTimeRef = useRef<Date | null>(null);
  const onTimeChange = useCallbackRef(_props.onTimeChange);
  const containerRef = useRef<HTMLDivElement>(null);
  const [measuredSize, setMeasuredSize] = useState<number | null>(null);
  const mergedRef = useMergedRef(ref, containerRef);

  const {
    // Clock-specific props that should not be passed to DOM
    size,
    color,
    hourTicksColor,
    hourTicksOpacity,
    minuteTicksColor,
    minuteTicksOpacity,
    primaryNumbersColor,
    primaryNumbersOpacity,
    secondaryNumbersColor,
    secondaryNumbersOpacity,
    secondHandBehavior,
    secondHandColor,
    secondHandOpacity,
    secondHandLength,
    secondHandSize,
    minuteHandColor,
    minuteHandOpacity,
    minuteHandSize,
    minuteHandLength,
    hourHandColor,
    hourHandOpacity,
    hourHandSize,
    hourHandLength,
    hourNumbersDistance,
    primaryNumbersProps,
    secondaryNumbersProps,
    timezone,
    running,
    value,
    ariaLabel,
    withSecondsArc,
    secondsArcFrom,
    secondsArcDirection,
    secondsArcColor,
    secondsArcOpacity,
    withMinutesArc,
    minutesArcFrom,
    minutesArcDirection,
    minutesArcColor,
    minutesArcOpacity,
    withHoursArc,
    hoursArcFrom,
    hoursArcDirection,
    hoursArcColor,
    hoursArcOpacity,
    sectors,
    faceContent,
    animateOnMount,
    animateOnMountDuration,
    shape,
    aspectRatio,
    borderRadius,
    onTimeChange: _onTimeChange,
    renderHourHand,
    renderMinuteHand,
    renderSecondHand,
    // Styles API props
    classNames,
    style,
    styles,
    unstyled,
    vars,
    className,
    ...others
  } = props;

  const getStyles = useStyles<ClockFactory>({
    name: 'Clock',
    props,
    classes,
    className,
    style,
    classNames,
    styles,
    unstyled,
    vars,
    varsResolver,
  });

  // Resolve responsive size to scalar value via useMatches
  const resolvedSize = useMatches(
    typeof size === 'object' && size !== null && !Array.isArray(size)
      ? (size as Record<string, unknown>)
      : { base: size ?? defaultProps.size }
  ) as MantineSize | number | string | undefined;

  const isAutoSize = resolvedSize === 'auto';

  const effectiveSize = isAutoSize
    ? (measuredSize ?? 400)
    : Math.round(
        px(
          getSize(
            typeof resolvedSize === 'string' && resolvedSize in defaultClockSizes
              ? defaultClockSizes[resolvedSize as keyof typeof defaultClockSizes]
              : resolvedSize || defaultProps.size!,
            'clock-size'
          )
        ) as number
      );

  const geometry = useMemo(
    () => createGeometry(effectiveSize, shape, { aspectRatio, borderRadius }),
    [effectiveSize, shape, aspectRatio, borderRadius]
  );

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // ResizeObserver for auto sizing
  useEffect(() => {
    if (!isAutoSize || !hasMounted) {
      return;
    }

    const element = containerRef.current;
    if (!element || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        const newSize = Math.round(Math.min(width, height));
        if (newSize > 0) {
          setMeasuredSize(newSize);
        }
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [isAutoSize, hasMounted]);

  // Calculate the effective time to display
  const getEffectiveTime = (): Date => {
    const parsedValue = parseTimeValue(value);

    if (!running) {
      // Static mode: show the parsed value or default to current time
      if (parsedValue) {
        return parsedValue;
      }
      // Use current time instead of fixed 12:00:00
      return time;
    }

    // Running mode
    if (parsedValue && startTimeRef.current && realStartTimeRef.current) {
      // Calculate elapsed time since we started
      const now = new Date();
      const elapsed = now.getTime() - realStartTimeRef.current.getTime();
      return new Date(startTimeRef.current.getTime() + elapsed);
    }

    // Default: real time
    return time;
  };

  useEffect(() => {
    // Clear existing interval and rAF
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    // If not running, don't start any interval
    if (!running) {
      return;
    }

    // Set up time tracking for custom start time
    const parsedValue = parseTimeValue(value);
    if (parsedValue) {
      startTimeRef.current = parsedValue;
      realStartTimeRef.current = new Date();
    } else {
      startTimeRef.current = null;
      realStartTimeRef.current = null;
    }

    const fireOnTimeChange = (now: Date) => {
      const tz = timezone && timezone !== '' ? dayjs(now).tz(timezone) : dayjs(now);
      onTimeChange({
        hours: tz.hour(),
        minutes: tz.minute(),
        seconds: tz.second(),
        milliseconds: tz.millisecond(),
      });
    };

    const updateTime = () => {
      const now = new Date();
      setTime(now);
      fireOnTimeChange(now);
    };

    updateTime();

    // P1: Use requestAnimationFrame for smooth mode
    if (secondHandBehavior === 'smooth') {
      const animate = () => {
        const now = new Date();
        setTime(now);
        fireOnTimeChange(now);
        rafRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      let interval = 1000;
      switch (secondHandBehavior) {
        case 'tick-half':
          interval = 500;
          break;
        case 'tick-high-freq':
          interval = 125;
          break;
        case 'tick':
        default:
          interval = 1000;
          break;
      }

      intervalRef.current = setInterval(updateTime, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [running, value, secondHandBehavior, timezone]);

  // Prevent hydration mismatch by not rendering dynamic content during SSR
  if (!hasMounted) {
    return (
      <Box
        {...getStyles('root', {
          style: {
            ...({ '--clock-size': `${effectiveSize}px` } as React.CSSProperties),
            ...(isAutoSize
              ? { width: '100%', height: '100%' }
              : { width: geometry.width, height: geometry.height }),
          },
        })}
        ref={mergedRef}
        role="img"
        aria-label={ariaLabel || 'Clock'}
        {...others}
      >
        {/* Render static clock structure during SSR */}
        <Box
          {...getStyles('clockContainer', {
            style: {
              width: geometry.width,
              height: geometry.height,
            },
          })}
        >
          <Box
            {...getStyles('glassWrapper', {
              style: { width: geometry.width, height: geometry.height },
            })}
          >
            <Box
              {...getStyles('clockFace', {
                style: {
                  width: geometry.width,
                  height: geometry.height,
                  borderRadius: geometry.borderRadius(),
                  clipPath: geometry.clipPath(),
                },
              })}
            >
              {/* Custom face content */}
              {faceContent && <Box {...getStyles('faceContent')}>{faceContent}</Box>}
              {/* Static hour marks and numbers only — shared ClockFaceStatic */}
              <ClockFaceStatic
                getStyles={getStyles}
                effectiveSize={effectiveSize}
                geometry={geometry}
                hourTicksOpacity={hourTicksOpacity}
                minuteTicksOpacity={minuteTicksOpacity}
                primaryNumbersOpacity={primaryNumbersOpacity}
                secondaryNumbersOpacity={secondaryNumbersOpacity}
                hourNumbersDistance={hourNumbersDistance}
                primaryNumbersProps={primaryNumbersProps}
                secondaryNumbersProps={secondaryNumbersProps}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  const effectiveTime = getEffectiveTime();

  // Build aria-label from the effective time
  const timezoneTime =
    timezone && timezone !== '' ? dayjs(effectiveTime).tz(timezone) : dayjs(effectiveTime);
  const computedAriaLabel =
    ariaLabel ||
    `Clock showing ${String(timezoneTime.hour()).padStart(2, '0')}:${String(timezoneTime.minute()).padStart(2, '0')}:${String(timezoneTime.second()).padStart(2, '0')}`;

  return (
    <Box
      {...getStyles('root', {
        style: {
          ...({ '--clock-size': `${effectiveSize}px` } as React.CSSProperties),
          ...(isAutoSize
            ? { width: '100%', height: '100%' }
            : { width: geometry.width, height: geometry.height }),
        },
      })}
      ref={mergedRef}
      role="img"
      aria-label={computedAriaLabel}
      {...others}
    >
      <RealClock
        time={effectiveTime}
        getStyles={getStyles}
        effectiveSize={effectiveSize}
        geometry={geometry}
        timezone={timezone}
        hourHandSize={hourHandSize}
        minuteHandSize={minuteHandSize}
        secondHandSize={secondHandSize}
        hourHandLength={hourHandLength}
        minuteHandLength={minuteHandLength}
        secondHandLength={secondHandLength}
        secondHandBehavior={secondHandBehavior}
        secondHandOpacity={secondHandOpacity}
        minuteHandOpacity={minuteHandOpacity}
        hourHandOpacity={hourHandOpacity}
        hourTicksOpacity={hourTicksOpacity}
        minuteTicksOpacity={minuteTicksOpacity}
        primaryNumbersOpacity={primaryNumbersOpacity}
        secondaryNumbersOpacity={secondaryNumbersOpacity}
        hourNumbersDistance={hourNumbersDistance}
        primaryNumbersProps={primaryNumbersProps}
        secondaryNumbersProps={secondaryNumbersProps}
        withSecondsArc={withSecondsArc}
        secondsArcFrom={secondsArcFrom}
        secondsArcDirection={secondsArcDirection}
        secondsArcOpacity={secondsArcOpacity}
        withMinutesArc={withMinutesArc}
        minutesArcFrom={minutesArcFrom}
        minutesArcDirection={minutesArcDirection}
        minutesArcOpacity={minutesArcOpacity}
        withHoursArc={withHoursArc}
        hoursArcFrom={hoursArcFrom}
        hoursArcDirection={hoursArcDirection}
        hoursArcOpacity={hoursArcOpacity}
        sectors={sectors}
        faceContent={faceContent}
        animateOnMount={animateOnMount}
        animateOnMountDuration={animateOnMountDuration}
        renderHourHand={renderHourHand}
        renderMinuteHand={renderMinuteHand}
        renderSecondHand={renderSecondHand}
      />
    </Box>
  );
});

Clock.Digital = ClockDigital;
Clock.classes = classes;
Clock.displayName = 'Clock';
