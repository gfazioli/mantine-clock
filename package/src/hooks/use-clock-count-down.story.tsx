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
        Status: {countdown.isCompleted ? 'Completed!' : 'Counting down...'}
      </Text>
      <Text size="xs" c="dimmed">
        Total ms remaining: {countdown.totalMilliseconds}
      </Text>
    </Paper>
  );
}

export function BasicCountdown() {
  const [enabled, setEnabled] = useState(true);

  // Countdown for 30 seconds
  const countdown30s = useClockCountDown({
    seconds: 30,
    enabled,
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
    enabled,
    onCountDownCompleted: () => {
      // eslint-disable-next-line no-console
      console.log('2 minutes countdown completed!');
    },
  });

  // Countdown for 1 hour in 12-hour format
  const countdown1h = useClockCountDown({
    hours: 1,
    enabled,
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
        <Button onClick={() => setEnabled(!enabled)} variant={enabled ? 'filled' : 'outline'}>
          {enabled ? 'Pause' : 'Resume'} All Countdowns
        </Button>
      </Group>

      <CountdownDisplay countdown={countdown30s} title="30 Seconds Countdown" />
      <CountdownDisplay countdown={countdown2m} title="2 Minutes Countdown" />
      <CountdownDisplay countdown={countdown1h} title="1 Hour Countdown (12h format)" />
    </Stack>
  );
}

export function SpecificDateCountdown() {
  // Countdown to end of current day
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const countdown = useClockCountDown({
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
  const [duration, setDuration] = useState({ hours: 0, minutes: 5, seconds: 30 });
  const [_, setKey] = useState(0);

  const countdown = useClockCountDown({
    hours: duration.hours,
    minutes: duration.minutes,
    seconds: duration.seconds,
    padHours: true,
    padMinutes: true,
    padSeconds: true,
    onCountDownCompleted: () => {
      // eslint-disable-next-line no-console
      console.log('Custom countdown completed!');
    },
  });

  const resetCountdown = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <Stack gap="md">
      <Title order={3}>Custom Duration Countdown</Title>

      <Group gap="xs">
        <Button size="sm" onClick={() => setDuration({ hours: 0, minutes: 1, seconds: 0 })}>
          1 Minute
        </Button>
        <Button size="sm" onClick={() => setDuration({ hours: 0, minutes: 5, seconds: 30 })}>
          5m 30s
        </Button>
        <Button size="sm" onClick={() => setDuration({ hours: 1, minutes: 30, seconds: 0 })}>
          1h 30m
        </Button>
        <Button size="sm" onClick={resetCountdown} variant="outline">
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

export function AllFeatures() {
  return (
    <Stack gap="xl">
      <BasicCountdown />
      <SpecificDateCountdown />
      <CustomDurationCountdown />
    </Stack>
  );
}
