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
  extends BoxProps,
    ClockBaseProps,
    ClockArcsProps,
    StylesApiProps<ClockFactory> {}

export type ClockFactory = Factory<{
  props: ClockProps;
  ref: HTMLDivElement;
  stylesNames: ClockStylesNames;
  vars: ClockCssVariables;
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

        '--clock-hour-ticks-opacity': (Math.round((hourTicksOpacity || 1) * 100) / 100).toString(),
        '--clock-minute-ticks-color': parseThemeColor({
          color: minuteTicksColor || '',
          theme,
        }).value,
        '--clock-minute-ticks-opacity': (
          Math.round((minuteTicksOpacity || 1) * 100) / 100
        ).toString(),
        '--clock-primary-numbers-color': parseThemeColor({
          color: primaryNumbersColor || '',
          theme,
        }).value,
        '--clock-primary-numbers-opacity': (
          Math.round((primaryNumbersOpacity || 1) * 100) / 100
        ).toString(),
        '--clock-secondary-numbers-color': parseThemeColor({
          color: secondaryNumbersColor || '',
          theme,
        }).value,
        '--clock-secondary-numbers-opacity': (
          Math.round((secondaryNumbersOpacity || 1) * 100) / 100
        ).toString(),
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

interface RealClockProps extends ClockBaseProps, ClockArcsProps {
  time: Date;
  getStyles: GetStylesApi<ClockFactory>;
  effectiveSize: number;
}

/**
 * RealClock component
 */
const RealClock: React.FC<RealClockProps> = (props) => {
  const {
    time,
    timezone,
    getStyles,
    effectiveSize,
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

  // Calculate second hand angle based on behavior
  let secondAngle = 0;

  switch (secondHandBehavior) {
    case 'tick':
      secondAngle = seconds * 6;
      break;
    case 'tick-half':
      secondAngle = (seconds + Math.floor(milliseconds / 500) * 0.5) * 6;
      break;
    case 'tick-high-freq':
      secondAngle = (seconds + Math.floor(milliseconds / 125) * 0.125) * 6;
      break;
    case 'smooth':
    default:
      secondAngle = (seconds + milliseconds / 1000) * 6;
      break;
  }

  // Use effective size for all calculations to maintain proportions
  const size = effectiveSize;
  const clockRadius = Math.round(size / 2);
  const numberRadius = Math.round(clockRadius * hourNumbersDistance);
  const calculatedHourHandLength = Math.round(
    clockRadius * (hourHandLength ?? defaultProps.hourHandLength!)
  );
  const calculatedMinuteHandLength = Math.round(
    clockRadius * (minuteHandLength ?? defaultProps.minuteHandLength!)
  );
  const calculatedSecondHandLength = Math.round(
    clockRadius * (secondHandLength ?? defaultProps.secondHandLength!)
  );

  const centerSize = Math.round(size * 0.034); // Center dot size
  const tickOffset = Math.round(size * 0.028); // Distance from edge for ticks

  // Helpers to compute angles and SVG path for sectors
  const toClockAngle = (deg: number) => ((deg % 360) + 360) % 360; // normalize

  const secAngleFromDate = (d: Date | null | undefined) => {
    if (!d) {
      return 0;
    }
    const dt = timezone && timezone !== '' ? dayjs(d).tz(timezone) : dayjs(d);
    const s = dt.second();
    const ms = dt.millisecond();
    return toClockAngle((s + ms / 1000) * 6);
  };

  const minAngleFromDate = (d: Date | null | undefined) => {
    if (!d) {
      return 0;
    }
    const dt = timezone && timezone !== '' ? dayjs(d).tz(timezone) : dayjs(d);
    const m = dt.minute();
    return toClockAngle(m * 6);
  };

  const hourAngleFromDate = (d: Date | null | undefined) => {
    if (!d) {
      return 0;
    }
    const dt = timezone && timezone !== '' ? dayjs(d).tz(timezone) : dayjs(d);
    const h = dt.hour() % 12;
    const m = dt.minute();
    return toClockAngle(h * 30 + m * 0.5);
  };

  const describeSector = (
    cx: number,
    cy: number,
    r: number,
    startDeg: number,
    endDeg: number,
    direction: 'clockwise' | 'counterClockwise'
  ) => {
    const start = toClockAngle(startDeg);
    const end = toClockAngle(endDeg);

    // Compute sweep and large-arc-flag based on direction
    let delta = 0;
    if (direction === 'clockwise') {
      delta = end - start;
      if (delta < 0) {
        delta += 360;
      }
    } else {
      delta = start - end;
      if (delta < 0) {
        delta += 360;
      }
    }
    // Use >= to avoid flipping around 180deg due to floating point noise
    const largeArc = delta >= 180 ? 1 : 0;
    const sweep = direction === 'clockwise' ? 1 : 0;

    const aStart = (start * Math.PI) / 180;
    const aEnd = (end * Math.PI) / 180;
    // Avoid rounding to integers to prevent jitter; keep subpixel precision
    const x1 = cx + r * Math.sin(aStart);
    const y1 = cy - r * Math.cos(aStart);
    const x2 = cx + r * Math.sin(aEnd);
    const y2 = cy - r * Math.cos(aEnd);

    // Format numbers to a reasonable precision to keep DOM diffs small
    const fmt = (n: number) => (Number.isFinite(n) ? n.toFixed(3) : '0');

    // Build sector path: center -> start point -> arc -> center
    return `M ${fmt(cx)} ${fmt(cy)} L ${fmt(x1)} ${fmt(y1)} A ${fmt(r)} ${fmt(r)} 0 ${largeArc} ${sweep} ${fmt(x2)} ${fmt(y2)} Z`;
  };

  const showSecArc = withSecondsArc === true && (secondsArcOpacity ?? 1) !== 0;
  const showMinArc = withMinutesArc === true && (minutesArcOpacity ?? 1) !== 0;
  const showHrArc = withHoursArc === true && (hoursArcOpacity ?? 1) !== 0;

  return (
    <Box {...getStyles('clockContainer')}>
      {/* Glass wrapper with shadow */}
      <Box {...getStyles('glassWrapper')}>
        {/* Clock face */}
        <Box {...getStyles('clockFace')}>
          {/* Arcs layer (rendered above face, below hands) */}
          {(showSecArc || showMinArc || showHrArc) && (
            <svg
              {...getStyles('arcsLayer', { style: { width: size, height: size } })}
              viewBox={`0 0 ${size} ${size}`}
            >
              {showHrArc && (
                <path
                  d={describeSector(
                    clockRadius,
                    clockRadius,
                    calculatedHourHandLength,
                    hourAngleFromDate(parseTimeValue(hoursArcFrom) ?? null),
                    hourAngle,
                    hoursArcDirection
                  )}
                  fill="var(--clock-hours-arc-color-resolved)"
                  fillOpacity={Math.round((hoursArcOpacity ?? 1) * 100) / 100}
                />
              )}
              {showMinArc && (
                <path
                  d={describeSector(
                    clockRadius,
                    clockRadius,
                    calculatedMinuteHandLength,
                    minAngleFromDate(parseTimeValue(minutesArcFrom) ?? null),
                    minuteAngle,
                    minutesArcDirection
                  )}
                  fill="var(--clock-minutes-arc-color-resolved)"
                  fillOpacity={Math.round((minutesArcOpacity ?? 1) * 100) / 100}
                />
              )}
              {showSecArc && (
                <path
                  d={describeSector(
                    clockRadius,
                    clockRadius,
                    calculatedSecondHandLength,
                    secAngleFromDate(parseTimeValue(secondsArcFrom) ?? null),
                    secondAngle,
                    secondsArcDirection
                  )}
                  fill="var(--clock-seconds-arc-color-resolved)"
                  fillOpacity={Math.round((secondsArcOpacity ?? 1) * 100) / 100}
                />
              )}
            </svg>
          )}
          {/* Hour marks container */}
          <Box {...getStyles('hourMarks')}>
            {/* Hour ticks */}
            {hourTicksOpacity !== 0 &&
              Array.from({ length: 12 }, (_, i) => (
                <Box
                  key={`hour-tick-${i}`}
                  {...getStyles('hourTick', {
                    style: {
                      top: tickOffset,
                      left: '50%',
                      transformOrigin: `50% ${clockRadius - tickOffset}px`,
                      transform: `translateX(-50%) rotate(${i * 30}deg)`,
                    },
                  })}
                />
              ))}

            {/* Minute ticks */}
            {minuteTicksOpacity !== 0 &&
              Array.from({ length: 60 }, (_, i) => {
                // Skip positions where hour ticks are (every 5 minutes)
                if (i % 5 === 0) {
                  return null;
                }

                return (
                  <Box
                    key={`minute-tick-${i}`}
                    {...getStyles('minuteTick', {
                      style: {
                        top: tickOffset,
                        left: '50%',
                        transformOrigin: `50% ${clockRadius - tickOffset}px`,
                        transform: `translateX(-50%) rotate(${i * 6}deg)`,
                      },
                    })}
                  />
                );
              })}

            {/* Hour numbers - Primary (12, 3, 6, 9) */}
            {primaryNumbersOpacity !== 0 &&
              [12, 3, 6, 9].map((num) => {
                // Calculate position based on hour number
                const i = num === 12 ? 0 : num;
                const angle = (i * 30 - 90) * (Math.PI / 180); // -90 to start from top (12 o'clock)
                const x = Math.round(clockRadius + Math.cos(angle) * numberRadius);
                const y = Math.round(clockRadius + Math.sin(angle) * numberRadius);

                return (
                  <Text
                    key={`primary-number-${num}`}
                    {...primaryNumbersProps}
                    {...getStyles('primaryNumber', {
                      className: getStyles('number').className,
                      style: {
                        left: x,
                        top: y,
                      },
                    })}
                  >
                    {num}
                  </Text>
                );
              })}

            {/* Hour numbers - Secondary (1, 2, 4, 5, 7, 8, 10, 11) */}
            {secondaryNumbersOpacity !== 0 &&
              [1, 2, 4, 5, 7, 8, 10, 11].map((num) => {
                // Calculate position based on hour number
                const i = num;
                const angle = (i * 30 - 90) * (Math.PI / 180); // -90 to start from top (12 o'clock)
                const x = Math.round(clockRadius + Math.cos(angle) * numberRadius);
                const y = Math.round(clockRadius + Math.sin(angle) * numberRadius);

                return (
                  <Text
                    key={`secondary-number-${num}`}
                    {...secondaryNumbersProps}
                    {...getStyles('secondaryNumber', {
                      className: getStyles('number').className,
                      style: {
                        left: x,
                        top: y,
                      },
                    })}
                  >
                    {num}
                  </Text>
                );
              })}
          </Box>

          {/* Hour hand */}
          {(hourHandOpacity ?? defaultProps.hourHandOpacity!) !== 0 && (
            <Box
              // {...getStyles('hand')}
              {...getStyles('hand', {
                className: getStyles('hourHand').className,
                style: {
                  width:
                    Math.round(size * (hourHandSize ?? defaultProps.hourHandSize!) * 100) / 100,
                  height: calculatedHourHandLength,
                  opacity:
                    Math.round((hourHandOpacity ?? defaultProps.hourHandOpacity!) * 100) / 100,
                  bottom: clockRadius,
                  left: clockRadius,
                  marginLeft:
                    Math.round((-(size * (hourHandSize ?? defaultProps.hourHandSize!)) / 2) * 100) /
                    100,
                  borderRadius: `${Math.round(size * (hourHandSize ?? defaultProps.hourHandSize!) * 100) / 100}px`,
                  transform: `rotate(${Math.round(hourAngle * 100) / 100}deg)`,
                },
              })}
            />
          )}

          {/* Minute hand */}
          {(minuteHandOpacity ?? defaultProps.minuteHandOpacity!) !== 0 && (
            <Box
              {...getStyles('hand', {
                className: getStyles('minuteHand').className,
                style: {
                  width:
                    Math.round(size * (minuteHandSize ?? defaultProps.minuteHandSize!) * 100) / 100,
                  height: calculatedMinuteHandLength,
                  opacity:
                    Math.round((minuteHandOpacity ?? defaultProps.minuteHandOpacity!) * 100) / 100,
                  bottom: clockRadius,
                  left: clockRadius,
                  marginLeft:
                    Math.round(
                      (-(size * (minuteHandSize ?? defaultProps.minuteHandSize!)) / 2) * 100
                    ) / 100,
                  borderRadius: `${Math.round(size * (minuteHandSize ?? defaultProps.minuteHandSize!) * 100) / 100}px`,
                  transform: `rotate(${Math.round(minuteAngle * 100) / 100}deg)`,
                },
              })}
            />
          )}

          {/* Second hand container */}
          {(secondHandOpacity ?? defaultProps.secondHandOpacity!) !== 0 && (
            <Box
              {...getStyles('secondHandContainer', {
                style: {
                  width:
                    Math.round(size * (secondHandSize ?? defaultProps.secondHandSize!) * 100) / 100,
                  height: calculatedSecondHandLength,
                  top: clockRadius - calculatedSecondHandLength,
                  left: clockRadius,
                  marginLeft:
                    Math.round(
                      (-(size * (secondHandSize ?? defaultProps.secondHandSize!)) / 2) * 100
                    ) / 100,
                  transformOrigin: `${Math.round(((size * (secondHandSize ?? defaultProps.secondHandSize!)) / 2) * 100) / 100}px ${calculatedSecondHandLength}px`,
                  transform: `rotate(${Math.round(secondAngle * 100) / 100}deg)`,
                },
              })}
            >
              {/* Second hand */}
              <Box
                {...getStyles('secondHand', {
                  style: {
                    width:
                      Math.round(size * (secondHandSize ?? defaultProps.secondHandSize!) * 100) /
                      100,
                    height: calculatedSecondHandLength,
                    opacity:
                      Math.round((secondHandOpacity ?? defaultProps.secondHandOpacity!) * 100) /
                      100,
                  },
                })}
              />

              {/* Second hand counterweight */}
              <Box
                {...getStyles('secondHandCounterweight', {
                  style: {
                    width: Math.round(size * 0.006 * 3 * 100) / 100,
                    opacity:
                      Math.round((secondHandOpacity ?? defaultProps.secondHandOpacity!) * 100) /
                      100,
                    left: Math.round(
                      (size * (secondHandSize ?? defaultProps.secondHandSize!)) / 2 -
                        (size * 0.006 * 3) / 2
                    ),
                  },
                })}
              />
            </Box>
          )}

          {/* Center blur */}
          <Box {...getStyles('centerBlur')} />

          {/* Center dot */}
          <Box
            {...getStyles('centerDot', {
              style: {
                width: centerSize,
                height: centerSize,
                opacity:
                  Math.round((secondHandOpacity ?? defaultProps.secondHandOpacity!) * 100) / 100,
                top: Math.round(clockRadius - centerSize / 2),
                left: Math.round(clockRadius - centerSize / 2),
              },
            })}
          />
        </Box>
      </Box>
    </Box>
  );
};

export const Clock = factory<ClockFactory>((_props, ref) => {
  const props = useProps('Clock', defaultProps, _props);
  const [time, setTime] = useState(new Date());
  const [hasMounted, setHasMounted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const realStartTimeRef = useRef<Date | null>(null);

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
    hourTicksOpacity: _hourTicksOpacity,
    minuteTicksOpacity: _minuteTicksOpacity,
    hourNumbersDistance,
    primaryNumbersProps,
    secondaryNumbersProps,
    timezone,
    running,
    value,
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

  const effectiveSize = Math.round(
    px(
      getSize(
        typeof size === 'string' && size in defaultClockSizes
          ? defaultClockSizes[size as keyof typeof defaultClockSizes]
          : size || defaultProps.size!,
        'clock-size'
      )
    ) as number
  );

  useEffect(() => {
    setHasMounted(true);
  }, []);

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
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
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

    let interval = 1000;
    switch (secondHandBehavior) {
      case 'smooth':
        interval = 16;
        break;
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

    const updateTime = () => {
      setTime(new Date());
    };

    updateTime();
    intervalRef.current = setInterval(updateTime, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [running, value, secondHandBehavior, secondHandOpacity]);

  // Prevent hydration mismatch by not rendering dynamic content during SSR
  if (!hasMounted) {
    return (
      <Box {...getStyles('root')} ref={ref} {...others}>
        {/* Render static clock structure during SSR */}
        <Box {...getStyles('clockContainer')}>
          <Box {...getStyles('glassWrapper')}>
            <Box {...getStyles('clockFace')}>
              {/* Static hour marks and numbers only */}
              <Box {...getStyles('hourMarks')}>
                {/* Hour ticks */}
                {(hourTicksOpacity || 1) !== 0 &&
                  Array.from({ length: 12 }, (_, i) => (
                    <Box
                      key={`hour-tick-${i}`}
                      {...getStyles('hourTick', {
                        style: {
                          top: Math.round(effectiveSize * 0.028),
                          left: '50%',
                          transformOrigin: `50% ${Math.round(effectiveSize / 2) - Math.round(effectiveSize * 0.028)}px`,
                          transform: `translateX(-50%) rotate(${i * 30}deg)`,
                        },
                      })}
                    />
                  ))}

                {/* Minute ticks */}
                {(minuteTicksOpacity || 1) !== 0 &&
                  Array.from({ length: 60 }, (_, i) => {
                    if (i % 5 === 0) {
                      return null;
                    }
                    return (
                      <Box
                        key={`minute-tick-${i}`}
                        {...getStyles('minuteTick', {
                          style: {
                            top: Math.round(effectiveSize * 0.028),
                            left: '50%',
                            transformOrigin: `50% ${Math.round(effectiveSize / 2) - Math.round(effectiveSize * 0.028)}px`,
                            transform: `translateX(-50%) rotate(${i * 6}deg)`,
                          },
                        })}
                      />
                    );
                  })}

                {/* Hour numbers - Primary (12, 3, 6, 9) */}
                {(primaryNumbersOpacity || 1) !== 0 &&
                  [12, 3, 6, 9].map((num) => {
                    const i = num === 12 ? 0 : num;
                    const angle = (i * 30 - 90) * (Math.PI / 180);
                    const clockRadius = Math.round(effectiveSize / 2);
                    const numberRadius = Math.round(clockRadius * (hourNumbersDistance || 0.75));
                    const x = Math.round(clockRadius + Math.cos(angle) * numberRadius);
                    const y = Math.round(clockRadius + Math.sin(angle) * numberRadius);

                    return (
                      <Text
                        key={`primary-number-${num}`}
                        {...primaryNumbersProps}
                        {...getStyles('primaryNumber', {
                          className: getStyles('number').className,
                          style: {
                            left: x,
                            top: y,
                          },
                        })}
                      >
                        {num}
                      </Text>
                    );
                  })}

                {/* Hour numbers - Secondary (1, 2, 4, 5, 7, 8, 10, 11) */}
                {(secondaryNumbersOpacity || 1) !== 0 &&
                  [1, 2, 4, 5, 7, 8, 10, 11].map((num) => {
                    const i = num;
                    const angle = (i * 30 - 90) * (Math.PI / 180);
                    const clockRadius = Math.round(effectiveSize / 2);
                    const numberRadius = Math.round(clockRadius * (hourNumbersDistance || 0.75));
                    const x = Math.round(clockRadius + Math.cos(angle) * numberRadius);
                    const y = Math.round(clockRadius + Math.sin(angle) * numberRadius);

                    return (
                      <Text
                        key={`secondary-number-${num}`}
                        {...secondaryNumbersProps}
                        {...getStyles('secondaryNumber', {
                          className: getStyles('number').className,
                          style: {
                            left: x,
                            top: y,
                          },
                        })}
                      >
                        {num}
                      </Text>
                    );
                  })}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  const effectiveTime = getEffectiveTime();

  return (
    <Box {...getStyles('root')} ref={ref} {...others}>
      <RealClock
        time={effectiveTime}
        getStyles={getStyles}
        effectiveSize={effectiveSize}
        {...props}
      />
    </Box>
  );
});

Clock.classes = classes;
Clock.displayName = 'Clock';
