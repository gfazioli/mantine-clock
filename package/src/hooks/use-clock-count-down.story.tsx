import React, { useState } from 'react';
import { Box, Button, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { useClockCountDown } from './use-clock-count-down';

export default {
  title: 'Hooks/useClockCountDown',
};

function CountdownDisplay({ countdown, title }: { countdown: any; title: string }) {
  return (
    <Paper p="md" withBorder>
      <Title order={4} mb="xs">
        {title}
      </Title>
      <Group gap="xs">
        <Text fw={700} c={countdown.isCompleted ? 'red' : undefined}>
          {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:
          {String(countdown.seconds).padStart(2, '0')}
        </Text>
        {countdown.amPm && <Text size="sm">{countdown.amPm}</Text>}
      </Group>
      <Text size="sm" c="dimmed" mt="xs">
        Status:{' '}
        {countdown.isCompleted ? 'Completed!' : countdown.isRunning ? 'Running...' : 'Paused'}
      </Text>
      <Text size="xs" c="dimmed">
        Total ms remaining: {countdown.totalMilliseconds.toLocaleString()}
      </Text>

      <Group gap="xs" mt="sm">
        <Button
          size="xs"
          onClick={countdown.start}
          disabled={countdown.isRunning || countdown.isCompleted}
        >
          Start
        </Button>
        <Button
          size="xs"
          onClick={countdown.pause}
          disabled={!countdown.isRunning}
          variant="outline"
        >
          Pause
        </Button>
        <Button
          size="xs"
          onClick={countdown.resume}
          disabled={countdown.isRunning || countdown.isCompleted}
          variant="light"
        >
          Resume
        </Button>
        <Button size="xs" onClick={countdown.reset} variant="subtle">
          Reset
        </Button>
      </Group>
    </Paper>
  );
}

export function BasicCountdown() {
  // Countdown for 30 seconds
  const countdown30s = useClockCountDown({
    seconds: 30,
    enabled: false, // Start paused to let user control
    padHours: true,
    padMinutes: true,
    padSeconds: true,
    onCountDownCompleted: () => {
      // eslint-disable-next-line no-console
      console.log('30 seconds countdown completed!');
    },
  });

  // Countdown for 2 minutes
  const countdown2m = useClockCountDown({
    minutes: 2,
    enabled: false, // Start paused to let user control
    onCountDownCompleted: () => {
      // eslint-disable-next-line no-console
      console.log('2 minutes countdown completed!');
    },
  });

  // Countdown for 1 hour in 12-hour format
  const countdown1h = useClockCountDown({
    hours: 1,
    enabled: false, // Start paused to let user control
    use24Hours: false,
    padHours: true,
    padMinutes: true,
    padSeconds: true,
    onCountDownCompleted: () => {
      // eslint-disable-next-line no-console
      console.log('1 hour countdown completed!');
    },
  });

  return (
    <Stack gap="md">
      <Group gap="xs">
        <Button
          onClick={countdown30s.start}
          disabled={countdown30s.isRunning || countdown30s.isCompleted}
        >
          Start 30s
        </Button>
        <Button onClick={countdown30s.pause} disabled={!countdown30s.isRunning}>
          Pause 30s
        </Button>
        <Button onClick={countdown30s.reset} variant="outline">
          Reset 30s
        </Button>
      </Group>

      <CountdownDisplay countdown={countdown30s} title="30 Seconds Countdown" />
      <CountdownDisplay countdown={countdown2m} title="2 Minutes Countdown" />
      <CountdownDisplay countdown={countdown1h} title="1 Hour Countdown (12h format)" />

      <Group gap="xs">
        <Button
          onClick={() => {
            countdown30s.start();
            countdown2m.start();
            countdown1h.start();
          }}
          disabled={countdown30s.isRunning && countdown2m.isRunning && countdown1h.isRunning}
        >
          Start All
        </Button>
        <Button
          onClick={() => {
            countdown30s.pause();
            countdown2m.pause();
            countdown1h.pause();
          }}
          disabled={!countdown30s.isRunning && !countdown2m.isRunning && !countdown1h.isRunning}
        >
          Pause All
        </Button>
        <Button
          onClick={() => {
            countdown30s.reset();
            countdown2m.reset();
            countdown1h.reset();
          }}
          variant="outline"
        >
          Reset All
        </Button>
      </Group>
    </Stack>
  );
}

export function SpecificDateCountdown() {
  // Countdown to end of current day - calculate once and memoize
  const [endOfDay] = useState(() => {
    const date = new Date();
    date.setHours(23, 59, 59, 999);
    return date;
  });

  const countdown = useClockCountDown({
    enabled: false, // Start paused to let user control
    targetDate: endOfDay,
    timezone: 'UTC',
    padHours: true,
    padMinutes: true,
    padSeconds: true,
    onCountDownCompleted: () => {
      // eslint-disable-next-line no-console
      console.log('End of day reached!');
    },
  });

  return (
    <Stack gap="md">
      <Title order={3}>Countdown to End of Day</Title>

      <Group gap="xs">
        <Button onClick={countdown.start} disabled={countdown.isRunning || countdown.isCompleted}>
          Start Countdown
        </Button>
        <Button onClick={countdown.pause} disabled={!countdown.isRunning} variant="outline">
          Pause
        </Button>
        <Button onClick={countdown.reset} variant="subtle">
          Reset
        </Button>
      </Group>

      <CountdownDisplay countdown={countdown} title="End of Day Countdown" />
      <Box>
        <Text size="sm" c="dimmed">
          Target: {endOfDay.toLocaleString()}
        </Text>
        <Text size="sm" c="dimmed">
          Days: {countdown.day}, Hours: {countdown.hours}, Minutes: {countdown.minutes}, Seconds:{' '}
          {countdown.seconds}
        </Text>
      </Box>
    </Stack>
  );
}

export function CustomDurationCountdown() {
  const [duration, setDuration] = useState({ hours: 0, minutes: 1, seconds: 0 });
  const [key, setKey] = useState(0);

  const countdown = useClockCountDown({
    hours: duration.hours,
    minutes: duration.minutes,
    seconds: duration.seconds,
    enabled: false, // Start paused
    padHours: true,
    padMinutes: true,
    padSeconds: true,
    onCountDownCompleted: () => {
      // eslint-disable-next-line no-console
      console.log('Custom countdown completed!');
    },
  });

  const handleDurationChange = (newDuration: {
    hours: number;
    minutes: number;
    seconds: number;
  }) => {
    setDuration(newDuration);
    setKey((prev) => prev + 1); // Force remount to reset countdown
  };

  return (
    <Stack gap="md" key={key}>
      <Title order={3}>Custom Duration Countdown</Title>

      <Group gap="xs">
        <Button
          size="sm"
          onClick={() => handleDurationChange({ hours: 0, minutes: 1, seconds: 0 })}
        >
          1 Minute
        </Button>
        <Button
          size="sm"
          onClick={() => handleDurationChange({ hours: 0, minutes: 5, seconds: 30 })}
        >
          5m 30s
        </Button>
        <Button
          size="sm"
          onClick={() => handleDurationChange({ hours: 1, minutes: 30, seconds: 0 })}
        >
          1h 30m
        </Button>
        <Button size="sm" onClick={countdown.reset} variant="outline">
          Reset
        </Button>
      </Group>

      <CountdownDisplay
        countdown={countdown}
        title={`Custom: ${duration.hours}h ${duration.minutes}m ${duration.seconds}s`}
      />
    </Stack>
  );
}

export function AutoStartCountdown() {
  // This countdown starts automatically (enabled: true by default)
  const autoCountdown = useClockCountDown({
    minutes: 2,
    seconds: 30,
    // enabled: true is the default
    padHours: true,
    padMinutes: true,
    padSeconds: true,
    onCountDownCompleted: () => {
      // eslint-disable-next-line no-console
      console.log('Auto countdown completed!');
    },
  });

  return (
    <Stack gap="md">
      <Title order={3}>Auto-Start Countdown (enabled: true)</Title>

      <Text size="sm" c="dimmed">
        This countdown starts automatically when mounted and reset will restart it automatically.
      </Text>

      <CountdownDisplay countdown={autoCountdown} title="Auto-Start 2m 30s Countdown" />
    </Stack>
  );
}

export function AllFeatures() {
  return (
    <Stack gap="xl">
      <BasicCountdown />
      <AutoStartCountdown />
      <SpecificDateCountdown />
      <CustomDurationCountdown />
    </Stack>
  );
}
