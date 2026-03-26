import React from 'react';
import {
  Box,
  BoxProps,
  createVarsResolver,
  Factory,
  factory,
  MantineColor,
  MantineSize,
  parseThemeColor,
  StylesApiProps,
  useProps,
  useRandomClassName,
  useStyles,
  type StyleProp,
} from '@mantine/core';
import { Timezone } from './Clock';
import { ClockDigitalMediaVariables } from './ClockDigitalMediaVariables';
import { useClock } from './hooks/use-clock';
import classes from './ClockDigital.module.css';

export type ClockDigitalStylesNames =
  | 'root'
  | 'segment'
  | 'hours'
  | 'separator'
  | 'minutes'
  | 'seconds'
  | 'amPm'
  | 'date';

export type ClockDigitalCssVariables = {
  root:
    | '--clock-digital-size'
    | '--clock-digital-color'
    | '--clock-digital-font-family'
    | '--clock-digital-gap';
};

export interface ClockDigitalProps extends BoxProps, StylesApiProps<ClockDigitalFactory> {
  /** Size preset or pixel value. Supports responsive values via breakpoint objects (e.g., `{ base: "sm", md: "lg" }`) */
  size?: StyleProp<MantineSize | number | (string & {})>;
  /** Text color */
  color?: MantineColor;
  /** Font family (default: monospace) */
  fontFamily?: string;
  /** Gap between segments. Supports responsive values via breakpoint objects (e.g., `{ base: 4, md: 8 }`) */
  gap?: StyleProp<number | string>;
  /** Timezone */
  timezone?: Timezone;
  /** 24-hour format (default: true) */
  use24Hours?: boolean;
  /** Show seconds (default: true) */
  showSeconds?: boolean;
  /** Show date below time (default: false) */
  showDate?: boolean;
  /** Show AM/PM indicator when use24Hours is false */
  showAmPm?: boolean;
  /** Separator character (default: ":") */
  separator?: string;
  /** Whether the clock is running (default: true) */
  running?: boolean;
  /** Update frequency in ms (default: 1000) */
  updateFrequency?: number;
  /** Pad hours with leading zero */
  padHours?: boolean;
  /** Pad minutes with leading zero (default: true) */
  padMinutes?: boolean;
  /** Pad seconds with leading zero (default: true) */
  padSeconds?: boolean;
}

export type ClockDigitalFactory = Factory<{
  props: ClockDigitalProps;
  ref: HTMLDivElement;
  stylesNames: ClockDigitalStylesNames;
  vars: ClockDigitalCssVariables;
}>;

const defaultDigitalProps: Partial<ClockDigitalProps> = {
  size: 'md',
  use24Hours: true,
  showSeconds: true,
  showDate: false,
  showAmPm: true,
  separator: ':',
  running: true,
  updateFrequency: 1000,
  padHours: true,
  padMinutes: true,
  padSeconds: true,
};

const digitalVarsResolver = createVarsResolver<ClockDigitalFactory>(
  (theme, { color, fontFamily }) => ({
    root: {
      '--clock-digital-size': undefined as unknown as string,
      '--clock-digital-color': color ? parseThemeColor({ color, theme }).value : '',
      '--clock-digital-font-family': fontFamily || '',
      '--clock-digital-gap': undefined as unknown as string,
    },
  })
);

export const ClockDigital = factory<ClockDigitalFactory>((_props, ref) => {
  const props = useProps('ClockDigital', defaultDigitalProps, _props);
  const {
    size,
    color,
    fontFamily,
    gap,
    timezone,
    use24Hours,
    showSeconds,
    showDate,
    showAmPm,
    separator,
    running,
    updateFrequency,
    padHours,
    padMinutes,
    padSeconds,
    classNames,
    style,
    styles,
    unstyled,
    vars,
    className,
    ...others
  } = props;

  const getStyles = useStyles<ClockDigitalFactory>({
    name: 'ClockDigital',
    props,
    classes,
    className,
    style,
    classNames,
    styles,
    unstyled,
    vars,
    varsResolver: digitalVarsResolver,
  });

  const responsiveClassName = useRandomClassName();

  const clock = useClock({
    enabled: running !== false,
    timezone,
    use24Hours,
    updateFrequency,
    padHours,
    padMinutes,
    padSeconds,
  });

  return (
    <>
      <ClockDigitalMediaVariables size={size} gap={gap} selector={`.${responsiveClassName}`} />
      <Box
        {...getStyles('root', { className: responsiveClassName })}
        ref={ref}
        role="timer"
        aria-label={`${clock.formattedHours}${separator}${clock.formattedMinutes}${showSeconds ? `${separator}${clock.formattedSeconds}` : ''}`}
        {...others}
      >
        <Box
          component="span"
          {...getStyles('segment', { className: getStyles('hours').className })}
        >
          {clock.formattedHours}
        </Box>
        <Box component="span" {...getStyles('separator')}>
          {separator}
        </Box>
        <Box
          component="span"
          {...getStyles('segment', { className: getStyles('minutes').className })}
        >
          {clock.formattedMinutes}
        </Box>
        {showSeconds && (
          <>
            <Box component="span" {...getStyles('separator')}>
              {separator}
            </Box>
            <Box
              component="span"
              {...getStyles('segment', { className: getStyles('seconds').className })}
            >
              {clock.formattedSeconds}
            </Box>
          </>
        )}
        {!use24Hours && showAmPm && clock.amPm && (
          <Box component="span" {...getStyles('amPm')}>
            {clock.amPm}
          </Box>
        )}
        {showDate && (
          <Box component="span" {...getStyles('date')}>
            {String(clock.day).padStart(2, '0')}/{String(clock.month).padStart(2, '0')}/{clock.year}
          </Box>
        )}
      </Box>
    </>
  );
});

ClockDigital.classes = classes;
ClockDigital.displayName = 'ClockDigital';
