import { useClockCountDown } from '@gfazioli/mantine-clock';
import { Group, Paper, Stack, Text, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `
import { useClockCountDown } from '@gfazioli/mantine-clock';

function Demo() {
  const countdown = useClockCountDown({
    hours: 2,
    minutes: 30,
    seconds: 45,
    padHours: true,
    padMinutes: true,
    padSeconds: true,
    onCountDownCompleted: () => console.log('Countdown completed!'),
  });

  return (
    <Paper p="md" withBorder>
      <Title order={4} mb="xs">Countdown Timer</Title>
      <Group gap="xs">
        <Text fw={700} c={countdown.isCompleted ? 'red' : undefined}>
          {countdown.formattedHours}:{countdown.formattedMinutes}:{countdown.formattedSeconds}
        </Text>
      </Group>
      <Text size="sm" c="dimmed" mt="xs">
        Status: {countdown.isCompleted ? 'Completed!' : 'Counting down...'}
      </Text>
    </Paper>
  );
}
`;

function Demo() {
  const countdown = useClockCountDown({
    hours: 2,
    minutes: 30,
    seconds: 45,
    padHours: true,
    padMinutes: true,
    padSeconds: true,
    onCountDownCompleted: () => {
      // eslint-disable-next-line no-console
      console.log('Countdown completed!');
    },
  });

  return (
    <Paper p="md" withBorder>
      <Title order={4} mb="xs">
        Countdown Timer
      </Title>
      <Group gap="xs">
        <Text fw={700} c={countdown.isCompleted ? 'red' : undefined}>
          {countdown.formattedHours}:{countdown.formattedMinutes}:{countdown.formattedSeconds}
        </Text>
      </Group>
      <Text size="sm" c="dimmed" mt="xs">
        Status: {countdown.isCompleted ? 'Completed!' : 'Counting down...'}
      </Text>
    </Paper>
  );
}

export const basic: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};

const shortCountdownCode = `
import { useClockCountDown } from '@gfazioli/mantine-clock';

function Demo() {
  const countdown = useClockCountDown({
    seconds: 30,
    onCountDownCompleted: () => alert('Time is up!'),
  });

  return (
    <Stack gap="xs">
      <Text size="xl" fw={700}>
        {countdown.seconds}s remaining
      </Text>
      <Text size="sm" c="dimmed">
        {countdown.isCompleted ? 'Time is up!' : 'Counting down...'}
      </Text>
    </Stack>
  );
}
`;

function ShortCountdownDemo() {
  const countdown = useClockCountDown({
    seconds: 30,
    onCountDownCompleted: () => {
      // eslint-disable-next-line no-alert
      alert('Time is up!');
    },
  });

  return (
    <Stack gap="xs">
      <Text size="xl" fw={700}>
        {countdown.seconds}s remaining
      </Text>
      <Text size="sm" c="dimmed">
        {countdown.isCompleted ? 'Time is up!' : 'Counting down...'}
      </Text>
    </Stack>
  );
}

export const shortCountdown: MantineDemo = {
  type: 'code',
  component: ShortCountdownDemo,
  code: shortCountdownCode,
  defaultExpanded: false,
};

const specificDateCode = `
import { useClockCountDown } from '@gfazioli/mantine-clock';

function Demo() {
  // Countdown to end of today
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  
  const countdown = useClockCountDown({
    targetDate: endOfDay,

    padHours: true,
    padMinutes: true,
    padSeconds: true,
  });

  return (
    <Paper p="md" withBorder>
      <Title order={4} mb="xs">Time Until End of Day</Title>
      <Group gap="xs">
        <Text fw={700}>
          {countdown.formattedHours}:{countdown.formattedMinutes}:{countdown.formattedSeconds}
        </Text>
      </Group>
      <Text size="xs" c="dimmed" mt="xs">
        {countdown.days} days, {countdown.hours} hours remaining
      </Text>
    </Paper>
  );
}
`;

function SpecificDateDemo() {
  // Countdown to end of today
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const countdown = useClockCountDown({
    targetDate: endOfDay,

    padHours: true,
    padMinutes: true,
    padSeconds: true,
  });

  return (
    <Paper p="md" withBorder>
      <Title order={4} mb="xs">
        Time Until End of Day
      </Title>
      <Group gap="xs">
        <Text fw={700}>
          {countdown.formattedHours}:{countdown.formattedMinutes}:{countdown.formattedSeconds}
        </Text>
      </Group>
      <Text size="xs" c="dimmed" mt="xs">
        {countdown.days} days, {countdown.hours} hours remaining
      </Text>
    </Paper>
  );
}

export const specificDate: MantineDemo = {
  type: 'code',
  component: SpecificDateDemo,
  code: specificDateCode,
  defaultExpanded: false,
};
