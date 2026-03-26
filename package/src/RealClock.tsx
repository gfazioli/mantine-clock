import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useState } from 'react';
import { Box, GetStylesApi } from '@mantine/core';
import type { ClockArcsProps, ClockBaseProps, ClockFactory } from './Clock';
import {
  CENTER_DOT_RATIO,
  COUNTERWEIGHT_MULTIPLIER,
  defaultClockProps as defaultProps,
  parseTimeValue,
  round2,
} from './clock-utils';
import { ClockFaceStatic } from './ClockFaceStatic';
import {
  hourAngleFromDate,
  minuteAngleFromDate,
  secondAngleFromDate,
  type ClockGeometry,
} from './geometry';

// Extend dayjs with timezone support
dayjs.extend(utc);
dayjs.extend(timezone);

interface RealClockProps extends ClockBaseProps, ClockArcsProps {
  time: Date;
  getStyles: GetStylesApi<ClockFactory>;
  effectiveSize: number;
  geometry: ClockGeometry;
}

export const RealClock = React.memo((props: RealClockProps) => {
  const {
    time,
    timezone: tz,
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
  const timezoneTime = tz && tz !== '' ? dayjs(time).tz(tz) : dayjs(time);

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
      const rafId = requestAnimationFrame(() => {
        setMountPhase('animating');
      });
      return () => cancelAnimationFrame(rafId);
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
  const { centerX, centerY } = geometry;
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

                  const startAngle = hourAngleFromDate(fromDate, tz);
                  const endAngle = hourAngleFromDate(toDate, tz);
                  const sectorRadius = calculatedMinuteHandLength;

                  return (
                    <path
                      key={`sector-${idx}`}
                      d={geometry.sectorPath(startAngle, endAngle, sectorRadius, 'clockwise')}
                      fill={sector.color || 'var(--clock-second-hand-color-resolved)'}
                      fillOpacity={round2(sector.opacity ?? 0.2)}
                      style={sector.interactive ? { cursor: 'pointer' } : undefined}
                      role={sector.interactive ? 'button' : undefined}
                      tabIndex={sector.interactive ? 0 : undefined}
                      aria-label={sector.interactive ? sector.label : undefined}
                      onClick={
                        sector.interactive && sector.onClick
                          ? () => sector.onClick!(sector)
                          : undefined
                      }
                      onKeyDown={
                        sector.interactive && sector.onClick
                          ? (e: React.KeyboardEvent) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                sector.onClick!(sector);
                              }
                            }
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
                    hourAngleFromDate(parseTimeValue(hoursArcFrom) ?? null, tz),
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
                    minuteAngleFromDate(parseTimeValue(minutesArcFrom) ?? null, tz),
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
                    secondAngleFromDate(parseTimeValue(secondsArcFrom) ?? null, tz),
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
                    bottom: centerY,
                    left: centerX,
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
                    bottom: centerY,
                    left: centerX,
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
                    top: centerY - calculatedSecondHandLength,
                    left: centerX,
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
                top: Math.round(centerY - centerSize / 2),
                left: Math.round(centerX - centerSize / 2),
              },
            })}
          />
        </Box>
      </Box>
    </Box>
  );
});
RealClock.displayName = 'RealClock';
