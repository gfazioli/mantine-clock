import React from 'react';
import { Button, Group, Paper, Stack, Text, Title } from '@mantine/core';
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

function ClockDisplay({ clock, title }: { clock: any; title: string }) {
  return (
    <Paper p="md" withBorder>
      <Title order={4} mb="xs">
        {title}
      </Title>
      <Group gap="xs">
        <Text fw={700} size="lg">
          {clock.hours}:{clock.minutes}:{clock.seconds}
        </Text>
        {clock.amPm && <Text size="sm">{clock.amPm}</Text>}
      </Group>
      <Text size="sm" c="dimmed" mt="xs">
        Status: {clock.isRunning ? 'Running...' : 'Paused'}
      </Text>
      <Text size="xs" c="dimmed">
        Date: {clock.year}-{String(clock.month).padStart(2, '0')}-
        {String(clock.day).padStart(2, '0')}
      </Text>

      <Group gap="xs" mt="sm">
        <Button size="xs" onClick={clock.start} disabled={clock.isRunning}>
          Start
        </Button>
        <Button size="xs" onClick={clock.pause} disabled={!clock.isRunning} variant="outline">
          Pause
        </Button>
        <Button size="xs" onClick={clock.resume} disabled={clock.isRunning} variant="light">
          Resume
        </Button>
        <Button size="xs" onClick={clock.reset} variant="subtle">
          Reset
        </Button>
      </Group>
    </Paper>
  );
}

export function ControlledClock() {
  // Clock that starts paused to let user control
  const clock = useClock({
    enabled: false, // Start paused
    timezone: 'UTC',
    padHours: true,
    padMinutes: true,
    padSeconds: true,
    use24Hours: true,
  });

  return (
    <Stack gap="md">
      <Title order={3}>Controlled Clock (enabled: false)</Title>

      <Text size="sm" c="dimmed">
        This clock starts paused and can be controlled manually with start/pause/resume/reset
        functions.
      </Text>

      <ClockDisplay clock={clock} title="UTC Clock with Controls" />
    </Stack>
  );
}

export function AutoStartClock() {
  // Clock that starts automatically (enabled: true by default)
  const autoClock = useClock({
    timezone: 'Europe/Rome',
    padHours: true,
    padMinutes: true,
    padSeconds: true,
    use24Hours: false,
    // enabled: true is the default
  });

  return (
    <Stack gap="md">
      <Title order={3}>Auto-Start Clock (enabled: true)</Title>

      <Text size="sm" c="dimmed">
        This clock starts automatically when mounted and reset will restart it automatically.
      </Text>

      <ClockDisplay clock={autoClock} title="Rome Time (Auto-Start)" />
    </Stack>
  );
}

export function MultipleClocks() {
  // Multiple clocks with different timezones
  const utcClock = useClock({
    enabled: false,
    timezone: 'UTC',
    padHours: true,
    padMinutes: true,
    padSeconds: true,
    use24Hours: true,
  });

  const nyClock = useClock({
    enabled: false,
    timezone: 'America/New_York',
    padHours: true,
    padMinutes: true,
    padSeconds: true,
    use24Hours: false,
  });

  const tokyoClock = useClock({
    enabled: false,
    timezone: 'Asia/Tokyo',
    padHours: true,
    padMinutes: true,
    padSeconds: true,
    use24Hours: true,
  });

  const allStopped = !utcClock.isRunning && !nyClock.isRunning && !tokyoClock.isRunning;

  return (
    <Stack gap="md">
      <Title order={3}>Multiple World Clocks</Title>

      <Group gap="xs">
        <Button
          onClick={() => {
            if (allStopped) {
              utcClock.start();
              nyClock.start();
              tokyoClock.start();
            } else {
              utcClock.pause();
              nyClock.pause();
              tokyoClock.pause();
            }
          }}
          disabled={false}
        >
          {allStopped ? 'Start All Clocks' : 'Pause All Clocks'}
        </Button>
        <Button
          onClick={() => {
            utcClock.reset();
            nyClock.reset();
            tokyoClock.reset();
          }}
          variant="outline"
        >
          Reset All
        </Button>
      </Group>

      <Stack gap="md">
        <ClockDisplay clock={utcClock} title="UTC Time" />
        <ClockDisplay clock={nyClock} title="New York Time" />
        <ClockDisplay clock={tokyoClock} title="Tokyo Time" />
      </Stack>
    </Stack>
  );
}

export function AllFeatures() {
  return (
    <Stack gap="xl">
      <ControlledClock />
      <AutoStartClock />
      <MultipleClocks />
    </Stack>
  );
}
