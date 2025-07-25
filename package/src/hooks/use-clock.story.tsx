import React from 'react';
import { useClock } from './use-clock';

export default {
  title: 'Hooks/useClock',
};

export const Default = () => {
  const { year, month, day, week, isLeap, hours, minutes, seconds, milliseconds } = useClock({
    timezone: 'UTC',
    updateFrequency: 1000,
    use24Hours: true,
  });

  return (
    <div style={{ fontFamily: 'monospace', padding: '20px' }}>
      <p>Year: {year}</p>
      <p>Month: {month}</p>
      <p>Day: {day}</p>
      <p>Week: {week}</p>
      <p>Is Leap Year: {isLeap ? 'Yes' : 'No'}</p>
      <p>
        Time: {hours}:{minutes}:{seconds}.{milliseconds}
      </p>
    </div>
  );
};

export const CustomTimezone = () => {
  const { year, month, day, hours, minutes, seconds, amPm } = useClock({
    timezone: 'America/New_York',
    updateFrequency: 1000,
    use24Hours: false,
  });

  return (
    <div style={{ fontFamily: 'monospace', padding: '20px' }}>
      <p>Year: {year}</p>
      <p>Month: {month}</p>
      <p>Day: {day}</p>
      <p>
        Time: {hours}:{minutes}:{seconds} {amPm}
      </p>
    </div>
  );
};

export const use24HourFormat = () => {
  const { year, month, day, hours, minutes, seconds } = useClock({
    updateFrequency: 1000,
    use24Hours: true,
  });

  return (
    <div style={{ fontFamily: 'monospace', padding: '20px' }}>
      <p>Year: {year}</p>
      <p>Month: {month}</p>
      <p>Day: {day}</p>
      <p>
        Time: {hours}:{minutes}:{seconds}
      </p>
    </div>
  );
};

export const PaddedSeconds = () => {
  const { year, month, day, hours, minutes, seconds, amPm } = useClock({
    timezone: 'UTC',
    updateFrequency: 1000,
    use24Hours: false,
    padSeconds: true,
  });

  // Pad minutes for visual consistency
  const paddedMinutes = minutes.toString().padStart(2, '0');

  return (
    <div style={{ fontFamily: 'monospace', padding: '20px' }}>
      <p>Year: {year}</p>
      <p>Month: {month}</p>
      <p>Day: {day}</p>
      <p>
        Time: {hours}:{paddedMinutes}:{seconds} {amPm}
      </p>
    </div>
  );
};

export const PaddedTime = () => {
  const { year, month, day, hours, minutes, seconds, amPm } = useClock({
    timezone: 'UTC',
    updateFrequency: 1000,
    use24Hours: false,
    padHours: true,
    padMinutes: true,
    padSeconds: true,
  });

  return (
    <div style={{ fontFamily: 'monospace', padding: '20px' }}>
      <p>Year: {year}</p>
      <p>Month: {month}</p>
      <p>Day: {day}</p>
      <p>
        Time: {hours}:{minutes}:{seconds} {amPm}
      </p>
    </div>
  );
};
