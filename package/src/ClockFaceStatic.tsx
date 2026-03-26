import React from 'react';
import { Box, GetStylesApi, Text, TextProps } from '@mantine/core';
import type { ClockFactory } from './Clock';
import { TICK_OFFSET_RATIO } from './clock-utils';
import type { ClockGeometry } from './geometry';

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

export const ClockFaceStatic = React.memo<ClockFaceStaticProps>(
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
