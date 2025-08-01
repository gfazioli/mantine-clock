import { useState } from 'react';
import { useClock } from '@gfazioli/mantine-clock';
import { Button, Group, Paper, Select, Stack, Switch, Text, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `
import { useClock } from '@gfazioli/mantine-clock';

function Demo() {
  const clock = useClock({
    enabled: false, // Start paused
    timezone: 'Europe/Rome',
    use24Hours: true,
    padHours: true,
    padMinutes: true,
    padSeconds: true,
    updateFrequency: 1000,
  });

  return (
    <Paper p="md" withBorder>
      <Title order={4} mb="xs">Digital Clock with Controls</Title>
      <Text fw={700} size="xl" mb="xs">
        {clock.hours}:{clock.minutes}:{clock.seconds}
      </Text>
      <Text size="sm" c="dimmed" mb="xs">
        {clock.day}/{clock.month}/{clock.year} - Week {clock.week}
      </Text>
      <Text size="xs" c="dimmed" mb="sm">
        Status: {clock.isRunning ? 'Running' : 'Paused'} | Leap Year: {clock.isLeap ? 'Yes' : 'No'}
      </Text>
      
      <Group gap="xs">
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
`;

function Demo() {
  const [timezone, setTimezone] = useState('Europe/Rome');
  const [use24Hours, setUse24Hours] = useState(true);

  const clock = useClock({
    enabled: false, // Start paused to show controls
    timezone,
    use24Hours,
    padHours: true,
    padMinutes: true,
    padSeconds: true,
    updateFrequency: 1000,
  });

  const timezoneOptions = [
    { value: 'UTC', label: 'UTC' },
    { value: 'Europe/Rome', label: 'Europe/Rome' },
    { value: 'America/New_York', label: 'America/New_York' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
    { value: 'Australia/Sydney', label: 'Australia/Sydney' },
  ];

  return (
    <Stack gap="md">
      <Group gap="md">
        <Select
          label="Timezone"
          data={timezoneOptions}
          value={timezone}
          onChange={(value) => setTimezone(value || 'UTC')}
          w={200}
        />
        <Switch
          label="24 Hour Format"
          checked={use24Hours}
          onChange={(event) => setUse24Hours(event.currentTarget.checked)}
        />
      </Group>

      <Paper p="md" withBorder>
        <Title order={4} mb="xs">
          Digital Clock with Controls
        </Title>
        <Text fw={700} size="xl" mb="xs">
          {clock.hours}:{clock.minutes}:{clock.seconds}
          {!use24Hours && clock.amPm && ` ${clock.amPm}`}
        </Text>
        <Text size="sm" c="dimmed" mb="xs">
          {clock.day}/{clock.month}/{clock.year} - Week {clock.week}
        </Text>
        <Text size="xs" c="dimmed" mb="sm">
          Status: {clock.isRunning ? 'Running' : 'Paused'} | Timezone: {timezone} | Leap Year:{' '}
          {clock.isLeap ? 'Yes' : 'No'}
        </Text>
        <Text size="xs" c="dimmed" mb="sm">
          Milliseconds: {clock.milliseconds}
        </Text>

        <Group gap="xs">
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
    </Stack>
  );
}

export const basic: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
