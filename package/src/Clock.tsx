import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  BoxProps,
  createVarsResolver,
  Factory,
  factory,
  getSize,
  GetStylesApi,
  MantineColor,
  MantineSize,
  parseThemeColor,
  px,
  StylesApiProps,
  Text,
  TextProps,
  useProps,
  useStyles,
} from '@mantine/core';
import { useMergedRef } from '@mantine/hooks';
import { ClockDigital } from './ClockDigital';
import {
  createGeometry,
  hourAngleFromDate,
  minuteAngleFromDate,
  secondAngleFromDate,
  type ClockGeometry,
} from './geometry';
import classes from './Clock.module.css';

// Extend dayjs with timezone support
dayjs.extend(utc);
dayjs.extend(timezone);

// --- Constants (A2) ---
const TICK_OFFSET_RATIO = 0.028;
const CENTER_DOT_RATIO = 0.034;
const COUNTERWEIGHT_MULTIPLIER = 3;

const round2 = (n: number): number => Math.round(n * 100) / 100;

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

  /** Size of the clock in pixels (default: 400px) */
  size?: MantineSize | number | (string & {});

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

  /** Aspect ratio for rounded-rect shape (default: 1, range: 0.6-1.5). Values < 1 = taller, > 1 = wider */
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

export const defaultProps: Partial<ClockProps> = {
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
  secondHandBehavior: 'tick',
  running: true,
};

const defaultClockSizes = {
  xs: 100,
  sm: 200,
  md: 400,
  lg: 480,
  xl: 512,
};

const varsResolver = createVarsResolver<ClockFactory>(
  (
    theme,
    {
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
      secondHandColor,
      minuteHandColor,
      hourHandColor,
      secondsArcColor,
      minutesArcColor,
      hoursArcColor,
    }
  ) => {
    // For 'auto' mode, use a fallback; the actual size is set via inline style
    if (size === 'auto') {
      return {
        root: {
          '--clock-size': '400px',
          '--clock-color': parseThemeColor({ color: color || '', theme }).value,
          '--clock-hour-ticks-color': parseThemeColor({ color: hourTicksColor || '', theme }).value,
          '--clock-hour-ticks-opacity': round2(hourTicksOpacity ?? 1).toString(),
          '--clock-minute-ticks-color': parseThemeColor({ color: minuteTicksColor || '', theme })
            .value,
          '--clock-minute-ticks-opacity': round2(minuteTicksOpacity ?? 1).toString(),
          '--clock-primary-numbers-color': parseThemeColor({
            color: primaryNumbersColor || '',
            theme,
          }).value,
          '--clock-primary-numbers-opacity': round2(primaryNumbersOpacity ?? 1).toString(),
          '--clock-secondary-numbers-color': parseThemeColor({
            color: secondaryNumbersColor || '',
            theme,
          }).value,
          '--clock-secondary-numbers-opacity': round2(secondaryNumbersOpacity ?? 1).toString(),
          '--clock-second-hand-color': parseThemeColor({ color: secondHandColor || '', theme })
            .value,
          '--clock-minute-hand-color': parseThemeColor({ color: minuteHandColor || '', theme })
            .value,
          '--clock-hour-hand-color': parseThemeColor({ color: hourHandColor || '', theme }).value,
          '--clock-seconds-arc-color': parseThemeColor({
            color: secondsArcColor || secondHandColor || '',
            theme,
          }).value,
          '--clock-minutes-arc-color': parseThemeColor({
            color: minutesArcColor || minuteHandColor || '',
            theme,
          }).value,
          '--clock-hours-arc-color': parseThemeColor({
            color: hoursArcColor || hourHandColor || '',
            theme,
          }).value,
        },
      };
    }

    const sizeValue = size || 'md';
    const clockSize =
      typeof sizeValue === 'string' && sizeValue in defaultClockSizes
        ? defaultClockSizes[sizeValue as keyof typeof defaultClockSizes]
        : sizeValue || defaultProps.size!;

    const effectiveSize = Math.round(px(getSize(clockSize, 'clock-size')) as number);

    return {
      root: {
        '--clock-size': `${effectiveSize}px`,
        '--clock-color': parseThemeColor({
          color: color || '',
          theme,
        }).value,
        '--clock-hour-ticks-color': parseThemeColor({
          color: hourTicksColor || '',
          theme,
        }).value,

        '--clock-hour-ticks-opacity': round2(hourTicksOpacity ?? 1).toString(),
        '--clock-minute-ticks-color': parseThemeColor({
          color: minuteTicksColor || '',
          theme,
        }).value,
        '--clock-minute-ticks-opacity': round2(minuteTicksOpacity ?? 1).toString(),
        '--clock-primary-numbers-color': parseThemeColor({
          color: primaryNumbersColor || '',
          theme,
        }).value,
        '--clock-primary-numbers-opacity': round2(primaryNumbersOpacity ?? 1).toString(),
        '--clock-secondary-numbers-color': parseThemeColor({
          color: secondaryNumbersColor || '',
          theme,
        }).value,
        '--clock-secondary-numbers-opacity': round2(secondaryNumbersOpacity ?? 1).toString(),
        '--clock-second-hand-color': parseThemeColor({
          color: secondHandColor || '',
          theme,
        }).value,
        '--clock-minute-hand-color': parseThemeColor({
          color: minuteHandColor || '',
          theme,
        }).value,
        '--clock-hour-hand-color': parseThemeColor({
          color: hourHandColor || '',
          theme,
        }).value,
        '--clock-seconds-arc-color': parseThemeColor({
          color: secondsArcColor || secondHandColor || '',
          theme,
        }).value,
        '--clock-minutes-arc-color': parseThemeColor({
          color: minutesArcColor || minuteHandColor || '',
          theme,
        }).value,
        '--clock-hours-arc-color': parseThemeColor({
          color: hoursArcColor || hourHandColor || '',
          theme,
        }).value,
      },
    };
  }
);

/**
 * Parse various time value formats into a Date object
 */
const parseTimeValue = (value: string | Date | dayjs.Dayjs | undefined): Date | null => {
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

// --- ClockFaceStatic component (A1) ---
interface ClockFaceStaticProps {
  getStyles: GetStylesApi<ClockFactory>;
  effectiveSize: number;
  geometry: ClockGeometry;
  hourTicksOpacity?: number;
  minuteTicksOpacity?: number;
  primaryNumbersOpacity?: number;
  secondaryNumbersOpacity?: number;
  hourNumbersDistance?: number;
  primaryNumbersProps?: TextProps;
  secondaryNumbersProps?: TextProps;
}

const ClockFaceStatic: React.FC<ClockFaceStaticProps> = React.memo(
  ({
    getStyles,
    effectiveSize,
    geometry,
    hourTicksOpacity,
    minuteTicksOpacity,
    primaryNumbersOpacity,
    secondaryNumbersOpacity,
    hourNumbersDistance = 0.75,
    primaryNumbersProps,
    secondaryNumbersProps,
  }) => {
    const clockRadius = Math.round(effectiveSize / 2);
    const numberRadius = Math.round(clockRadius * hourNumbersDistance);
    const tickOffset = Math.round(effectiveSize * TICK_OFFSET_RATIO);

    return (
      <Box {...getStyles('hourMarks')}>
        {/* Hour ticks */}
        {(hourTicksOpacity ?? 1) !== 0 &&
          Array.from({ length: 12 }, (_, i) => {
            const pos = geometry.tickPosition(i, 12, tickOffset);
            const tickStyle =
              pos.positioning === 'absolute'
                ? {
                    top: pos.y,
                    left: pos.x,
                    transformOrigin: pos.transformOrigin,
                    transform: `translate(-50%, -50%) rotate(${pos.angle}deg)`,
                  }
                : {
                    top: pos.y,
                    left: '50%',
                    transformOrigin: pos.transformOrigin,
                    transform: `translateX(-50%) rotate(${pos.angle}deg)`,
                  };
            return <Box key={`hour-tick-${i}`} {...getStyles('hourTick', { style: tickStyle })} />;
          })}

        {/* Minute ticks */}
        {(minuteTicksOpacity ?? 1) !== 0 &&
          Array.from({ length: 60 }, (_, i) => {
            // Skip positions where hour ticks are (every 5 minutes)
            if (i % 5 === 0) {
              return null;
            }

            const pos = geometry.tickPosition(i, 60, tickOffset);
            const tickStyle =
              pos.positioning === 'absolute'
                ? {
                    top: pos.y,
                    left: pos.x,
                    transformOrigin: pos.transformOrigin,
                    transform: `translate(-50%, -50%) rotate(${pos.angle}deg)`,
                  }
                : {
                    top: pos.y,
                    left: '50%',
                    transformOrigin: pos.transformOrigin,
                    transform: `translateX(-50%) rotate(${pos.angle}deg)`,
                  };
            return (
              <Box key={`minute-tick-${i}`} {...getStyles('minuteTick', { style: tickStyle })} />
            );
          })}

        {/* Hour numbers - Primary (12, 3, 6, 9) */}
        {(primaryNumbersOpacity ?? 1) !== 0 &&
          [12, 3, 6, 9].map((num) => {
            const hourIndex = num === 12 ? 0 : num;
            const pos = geometry.numberPosition(hourIndex, numberRadius);

            return (
              <Text
                key={`primary-number-${num}`}
                {...primaryNumbersProps}
                {...getStyles('primaryNumber', {
                  className: getStyles('number').className,
                  style: {
                    left: pos.x,
                    top: pos.y,
                  },
                })}
              >
                {num}
              </Text>
            );
          })}

        {/* Hour numbers - Secondary (1, 2, 4, 5, 7, 8, 10, 11) */}
        {(secondaryNumbersOpacity ?? 1) !== 0 &&
          [1, 2, 4, 5, 7, 8, 10, 11].map((num) => {
            const pos = geometry.numberPosition(num, numberRadius);

            return (
              <Text
                key={`secondary-number-${num}`}
                {...secondaryNumbersProps}
                {...getStyles('secondaryNumber', {
                  className: getStyles('number').className,
                  style: {
                    left: pos.x,
                    top: pos.y,
                  },
                })}
              >
                {num}
              </Text>
            );
          })}
      </Box>
    );
  }
);

ClockFaceStatic.displayName = 'ClockFaceStatic';

interface RealClockProps extends ClockBaseProps, ClockArcsProps {
  time: Date;
  getStyles: GetStylesApi<ClockFactory>;
  effectiveSize: number;
  geometry: ClockGeometry;
}

/**
 * RealClock component
 */
const RealClock: React.FC<RealClockProps> = React.memo((props) => {
  const {
    time,
    timezone,
    getStyles,
    effectiveSize,
    geometry,
    hourHandSize,
    minuteHandSize,
    secondHandSize,
    hourHandLength,
    minuteHandLength,
    secondHandLength,
    secondHandBehavior,
    secondHandOpacity,
    minuteHandOpacity,
    hourHandOpacity,
    hourTicksOpacity,
    minuteTicksOpacity,
    primaryNumbersOpacity,
    secondaryNumbersOpacity,
    hourNumbersDistance = 0.75, // Default distance for hour numbers
    primaryNumbersProps,
    secondaryNumbersProps,
    withSecondsArc,
    secondsArcFrom,
    secondsArcDirection = 'clockwise',
    withMinutesArc,
    minutesArcFrom,
    minutesArcDirection = 'clockwise',
    withHoursArc,
    hoursArcFrom,
    hoursArcDirection = 'clockwise',
    secondsArcOpacity,
    minutesArcOpacity,
    hoursArcOpacity,
    renderHourHand,
    renderMinuteHand,
    renderSecondHand,
    sectors,
    faceContent,
    animateOnMount,
    animateOnMountDuration,
  } = props;

  // Use dayjs to handle timezone conversion
  const timezoneTime = timezone && timezone !== '' ? dayjs(time).tz(timezone) : dayjs(time);

  const hours = timezoneTime.hour() % 12;
  const minutes = timezoneTime.minute();
  const seconds = timezoneTime.second();
  const milliseconds = timezoneTime.millisecond();

  // Calculate angles for clock hands (12 o'clock = 0 degrees)
  const hourAngle = hours * 30 + minutes * 0.5; // 30 degrees per hour + minute adjustment
  const minuteAngle = minutes * 6; // 6 degrees per minute

  // Calculate second hand angle based on behavior (B4: default is now 'tick')
  let secondAngle = 0;

  switch (secondHandBehavior) {
    case 'tick-half':
      secondAngle = (seconds + Math.floor(milliseconds / 500) * 0.5) * 6;
      break;
    case 'tick-high-freq':
      secondAngle = (seconds + Math.floor(milliseconds / 125) * 0.125) * 6;
      break;
    case 'smooth':
      secondAngle = (seconds + milliseconds / 1000) * 6;
      break;
    case 'tick':
    default:
      secondAngle = seconds * 6;
      break;
  }

  // --- Mount animation (Phase 6) ---
  const [mountPhase, setMountPhase] = useState<'initial' | 'animating' | 'done'>(
    animateOnMount ? 'initial' : 'done'
  );

  useEffect(() => {
    if (mountPhase === 'initial') {
      // After first render at 0deg, trigger animation to real angles
      requestAnimationFrame(() => {
        setMountPhase('animating');
      });
    } else if (mountPhase === 'animating') {
      const timer = setTimeout(
        () => {
          setMountPhase('done');
        },
        (animateOnMountDuration ?? 1000) + 50
      );
      return () => clearTimeout(timer);
    }
  }, [mountPhase, animateOnMountDuration]);

  const showTransition = mountPhase === 'animating';
  const handAngles =
    mountPhase === 'initial'
      ? { hour: 0, minute: 0, second: 0 }
      : { hour: round2(hourAngle), minute: round2(minuteAngle), second: round2(secondAngle) };

  const transitionStyle = showTransition
    ? {
        transition: `transform ${animateOnMountDuration ?? 1000}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
      }
    : undefined;

  // Use effective size for all calculations to maintain proportions
  const size = effectiveSize;
  const clockRadius = geometry.centerX;
  const calculatedHourHandLength = geometry.handLength(
    hourHandLength ?? defaultProps.hourHandLength!
  );
  const calculatedMinuteHandLength = geometry.handLength(
    minuteHandLength ?? defaultProps.minuteHandLength!
  );
  const calculatedSecondHandLength = geometry.handLength(
    secondHandLength ?? defaultProps.secondHandLength!
  );

  const centerSize = Math.round(size * CENTER_DOT_RATIO); // Center dot size

  const showSecArc = withSecondsArc === true && (secondsArcOpacity ?? 1) !== 0;
  const showMinArc = withMinutesArc === true && (minutesArcOpacity ?? 1) !== 0;
  const showHrArc = withHoursArc === true && (hoursArcOpacity ?? 1) !== 0;

  // Counterweight width using secondHandSize (B3)
  const counterweightWidth = round2(
    size * (secondHandSize ?? defaultProps.secondHandSize!) * COUNTERWEIGHT_MULTIPLIER
  );

  return (
    <Box
      {...getStyles('clockContainer', {
        style: {
          width: geometry.width,
          height: geometry.height,
        },
      })}
    >
      {/* Glass wrapper with shadow */}
      <Box
        {...getStyles('glassWrapper', {
          style: { width: geometry.width, height: geometry.height },
        })}
      >
        {/* Clock face */}
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
          {/* Arcs layer (rendered above face, below hands) */}
          {(showSecArc || showMinArc || showHrArc || (sectors && sectors.length > 0)) && (
            <svg
              {...getStyles('arcsLayer', {
                style: { width: geometry.width, height: geometry.height },
              })}
              viewBox={`0 0 ${geometry.width} ${geometry.height}`}
            >
              {/* Sectors (rendered below arcs) */}
              {sectors &&
                sectors.length > 0 &&
                sectors.map((sector, idx) => {
                  const fromDate = parseTimeValue(sector.from);
                  const toDate = parseTimeValue(sector.to);
                  if (!fromDate || !toDate) {
                    return null;
                  }

                  const startAngle = hourAngleFromDate(fromDate, timezone);
                  const endAngle = hourAngleFromDate(toDate, timezone);
                  const sectorRadius = calculatedMinuteHandLength;

                  return (
                    <path
                      key={`sector-${idx}`}
                      d={geometry.sectorPath(startAngle, endAngle, sectorRadius, 'clockwise')}
                      fill={sector.color || 'var(--clock-second-hand-color-resolved)'}
                      fillOpacity={round2(sector.opacity ?? 0.2)}
                      style={sector.interactive ? { cursor: 'pointer' } : undefined}
                      onClick={
                        sector.interactive && sector.onClick
                          ? () => sector.onClick!(sector)
                          : undefined
                      }
                      onMouseEnter={
                        sector.interactive && sector.onHover
                          ? () => sector.onHover!(sector, true)
                          : undefined
                      }
                      onMouseLeave={
                        sector.interactive && sector.onHover
                          ? () => sector.onHover!(sector, false)
                          : undefined
                      }
                    >
                      {sector.label && <title>{sector.label}</title>}
                    </path>
                  );
                })}
              {showHrArc && (
                <path
                  d={geometry.sectorPath(
                    hourAngleFromDate(parseTimeValue(hoursArcFrom) ?? null, timezone),
                    hourAngle,
                    calculatedHourHandLength,
                    hoursArcDirection
                  )}
                  fill="var(--clock-hours-arc-color-resolved)"
                  fillOpacity={round2(hoursArcOpacity ?? 1)}
                />
              )}
              {showMinArc && (
                <path
                  d={geometry.sectorPath(
                    minuteAngleFromDate(parseTimeValue(minutesArcFrom) ?? null, timezone),
                    minuteAngle,
                    calculatedMinuteHandLength,
                    minutesArcDirection
                  )}
                  fill="var(--clock-minutes-arc-color-resolved)"
                  fillOpacity={round2(minutesArcOpacity ?? 1)}
                />
              )}
              {showSecArc && (
                <path
                  d={geometry.sectorPath(
                    secondAngleFromDate(parseTimeValue(secondsArcFrom) ?? null, timezone),
                    secondAngle,
                    calculatedSecondHandLength,
                    secondsArcDirection
                  )}
                  fill="var(--clock-seconds-arc-color-resolved)"
                  fillOpacity={round2(secondsArcOpacity ?? 1)}
                />
              )}
            </svg>
          )}
          {/* Hour marks container — shared ClockFaceStatic */}
          <ClockFaceStatic
            getStyles={getStyles}
            effectiveSize={size}
            geometry={geometry}
            hourTicksOpacity={hourTicksOpacity}
            minuteTicksOpacity={minuteTicksOpacity}
            primaryNumbersOpacity={primaryNumbersOpacity}
            secondaryNumbersOpacity={secondaryNumbersOpacity}
            hourNumbersDistance={hourNumbersDistance}
            primaryNumbersProps={primaryNumbersProps}
            secondaryNumbersProps={secondaryNumbersProps}
          />

          {/* Hour hand */}
          {(hourHandOpacity ?? defaultProps.hourHandOpacity!) !== 0 &&
            (renderHourHand ? (
              renderHourHand({
                angle: handAngles.hour,
                length: calculatedHourHandLength,
                width: round2(size * (hourHandSize ?? defaultProps.hourHandSize!)),
                centerX: geometry.centerX,
                centerY: geometry.centerY,
                clockSize: size,
              })
            ) : (
              <Box
                {...getStyles('hand', {
                  className: getStyles('hourHand').className,
                  style: {
                    width: round2(size * (hourHandSize ?? defaultProps.hourHandSize!)),
                    height: calculatedHourHandLength,
                    opacity: round2(hourHandOpacity ?? defaultProps.hourHandOpacity!),
                    bottom: clockRadius,
                    left: clockRadius,
                    marginLeft: round2(-(size * (hourHandSize ?? defaultProps.hourHandSize!)) / 2),
                    borderRadius: `${round2(size * (hourHandSize ?? defaultProps.hourHandSize!))}px`,
                    transform: `rotate(${handAngles.hour}deg)`,
                    ...transitionStyle,
                  },
                })}
              />
            ))}

          {/* Minute hand */}
          {(minuteHandOpacity ?? defaultProps.minuteHandOpacity!) !== 0 &&
            (renderMinuteHand ? (
              renderMinuteHand({
                angle: handAngles.minute,
                length: calculatedMinuteHandLength,
                width: round2(size * (minuteHandSize ?? defaultProps.minuteHandSize!)),
                centerX: geometry.centerX,
                centerY: geometry.centerY,
                clockSize: size,
              })
            ) : (
              <Box
                {...getStyles('hand', {
                  className: getStyles('minuteHand').className,
                  style: {
                    width: round2(size * (minuteHandSize ?? defaultProps.minuteHandSize!)),
                    height: calculatedMinuteHandLength,
                    opacity: round2(minuteHandOpacity ?? defaultProps.minuteHandOpacity!),
                    bottom: clockRadius,
                    left: clockRadius,
                    marginLeft: round2(
                      -(size * (minuteHandSize ?? defaultProps.minuteHandSize!)) / 2
                    ),
                    borderRadius: `${round2(size * (minuteHandSize ?? defaultProps.minuteHandSize!))}px`,
                    transform: `rotate(${handAngles.minute}deg)`,
                    ...transitionStyle,
                  },
                })}
              />
            ))}

          {/* Second hand container */}
          {(secondHandOpacity ?? defaultProps.secondHandOpacity!) !== 0 &&
            (renderSecondHand ? (
              renderSecondHand({
                angle: handAngles.second,
                length: calculatedSecondHandLength,
                width: round2(size * (secondHandSize ?? defaultProps.secondHandSize!)),
                centerX: geometry.centerX,
                centerY: geometry.centerY,
                clockSize: size,
              })
            ) : (
              <Box
                {...getStyles('secondHandContainer', {
                  style: {
                    width: round2(size * (secondHandSize ?? defaultProps.secondHandSize!)),
                    height: calculatedSecondHandLength,
                    top: clockRadius - calculatedSecondHandLength,
                    left: clockRadius,
                    marginLeft: round2(
                      -(size * (secondHandSize ?? defaultProps.secondHandSize!)) / 2
                    ),
                    transformOrigin: `${round2((size * (secondHandSize ?? defaultProps.secondHandSize!)) / 2)}px ${calculatedSecondHandLength}px`,
                    transform: `rotate(${handAngles.second}deg)`,
                    ...transitionStyle,
                  },
                })}
              >
                {/* Second hand */}
                <Box
                  {...getStyles('secondHand', {
                    style: {
                      width: round2(size * (secondHandSize ?? defaultProps.secondHandSize!)),
                      height: calculatedSecondHandLength,
                      opacity: round2(secondHandOpacity ?? defaultProps.secondHandOpacity!),
                    },
                  })}
                />

                {/* Second hand counterweight (B3) */}
                <Box
                  {...getStyles('secondHandCounterweight', {
                    style: {
                      width: counterweightWidth,
                      opacity: round2(secondHandOpacity ?? defaultProps.secondHandOpacity!),
                      left: Math.round(
                        (size * (secondHandSize ?? defaultProps.secondHandSize!)) / 2 -
                          counterweightWidth / 2
                      ),
                    },
                  })}
                />
              </Box>
            ))}

          {/* Center blur */}
          <Box {...getStyles('centerBlur')} />

          {/* Center dot */}
          <Box
            {...getStyles('centerDot', {
              style: {
                width: centerSize,
                height: centerSize,
                opacity: round2(secondHandOpacity ?? defaultProps.secondHandOpacity!),
                top: Math.round(clockRadius - centerSize / 2),
                left: Math.round(clockRadius - centerSize / 2),
              },
            })}
          />
        </Box>
      </Box>
    </Box>
  );
});

RealClock.displayName = 'RealClock';

export const Clock = factory<ClockFactory>((_props, ref) => {
  const props = useProps('Clock', defaultProps, _props);
  const [time, setTime] = useState(new Date());
  const [hasMounted, setHasMounted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const realStartTimeRef = useRef<Date | null>(null);
  const onTimeChangeRef = useRef(_props.onTimeChange);
  const containerRef = useRef<HTMLDivElement>(null);
  const [measuredSize, setMeasuredSize] = useState<number | null>(null);
  const mergedRef = useMergedRef(ref, containerRef);

  useEffect(() => {
    onTimeChangeRef.current = _props.onTimeChange;
  }, [_props.onTimeChange]);

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
    onTimeChange,
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

  const effectiveSize =
    size === 'auto'
      ? (measuredSize ?? 400)
      : Math.round(
          px(
            getSize(
              typeof size === 'string' && size in defaultClockSizes
                ? defaultClockSizes[size as keyof typeof defaultClockSizes]
                : size || defaultProps.size!,
              'clock-size'
            )
          ) as number
        );

  const geometry = createGeometry(effectiveSize, shape, { aspectRatio, borderRadius });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // ResizeObserver for auto sizing
  useEffect(() => {
    if (size !== 'auto' || !hasMounted) {
      return;
    }

    const element = containerRef.current;
    if (!element) {
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
  }, [size, hasMounted]);

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
      if (onTimeChangeRef.current) {
        const tz = timezone && timezone !== '' ? dayjs(now).tz(timezone) : dayjs(now);
        onTimeChangeRef.current({
          hours: tz.hour(),
          minutes: tz.minute(),
          seconds: tz.second(),
          milliseconds: tz.millisecond(),
        });
      }
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
  }, [running, value, secondHandBehavior]);

  // Prevent hydration mismatch by not rendering dynamic content during SSR
  if (!hasMounted) {
    return (
      <Box
        {...getStyles('root', {
          style:
            size === 'auto'
              ? { width: '100%', height: '100%', '--clock-size': `${effectiveSize}px` }
              : { width: geometry.width, height: geometry.height },
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
        style:
          size === 'auto'
            ? { width: '100%', height: '100%', '--clock-size': `${effectiveSize}px` }
            : { width: geometry.width, height: geometry.height },
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
