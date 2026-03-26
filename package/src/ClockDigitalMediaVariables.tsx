import React from 'react';
import {
  filterProps,
  getBaseValue,
  getSortedBreakpoints,
  InlineStyles,
  keys,
  useMantineTheme,
  type MantineBreakpoint,
  type MantineSize,
  type StyleProp,
} from '@mantine/core';

const defaultDigitalSizes: Record<string, number> = {
  xs: 14,
  sm: 20,
  md: 32,
  lg: 48,
  xl: 64,
};

function toSizePx(value: MantineSize | number | string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value === 'number') {
    return `${value}px`;
  }
  if (typeof value === 'string' && value in defaultDigitalSizes) {
    return `${defaultDigitalSizes[value]}px`;
  }
  return typeof value === 'string' ? value : undefined;
}

function toGapValue(value: number | string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return typeof value === 'number' ? `${value}px` : value;
}

interface ClockDigitalMediaVariablesProps {
  size?: StyleProp<MantineSize | number | (string & {})>;
  gap?: StyleProp<number | string>;
  selector: string;
}

export function ClockDigitalMediaVariables({
  size,
  gap,
  selector,
}: ClockDigitalMediaVariablesProps) {
  const theme = useMantineTheme();

  const baseStyles: Record<string, string | undefined> = filterProps({
    '--clock-digital-size': toSizePx(getBaseValue(size) as MantineSize | number | string),
    '--clock-digital-gap': toGapValue(getBaseValue(gap) as number | string),
  });

  const queries = keys(theme.breakpoints).reduce<Record<string, Record<string, string>>>(
    (acc, breakpoint) => {
      if (!acc[breakpoint]) {
        acc[breakpoint] = {};
      }

      if (
        typeof size === 'object' &&
        size !== null &&
        (size as Record<string, unknown>)[breakpoint] !== undefined
      ) {
        const val = toSizePx(
          (size as Record<string, unknown>)[breakpoint] as MantineSize | number | string
        );
        if (val) {
          acc[breakpoint]['--clock-digital-size'] = val;
        }
      }

      if (
        typeof gap === 'object' &&
        gap !== null &&
        (gap as Record<string, unknown>)[breakpoint] !== undefined
      ) {
        const val = toGapValue((gap as Record<string, unknown>)[breakpoint] as number | string);
        if (val) {
          acc[breakpoint]['--clock-digital-gap'] = val;
        }
      }

      return acc;
    },
    {}
  );

  const sortedBreakpoints = getSortedBreakpoints(keys(queries), theme.breakpoints).filter(
    (breakpoint) => keys(queries[breakpoint.value]).length > 0
  );

  const media = sortedBreakpoints.map((breakpoint) => ({
    query: `(min-width: ${theme.breakpoints[breakpoint.value as MantineBreakpoint]})`,
    styles: queries[breakpoint.value],
  }));

  return <InlineStyles styles={baseStyles} media={media} selector={selector} />;
}
