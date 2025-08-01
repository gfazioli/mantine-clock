import { useState } from 'react';
import { useClockCountDown } from '@gfazioli/mantine-clock';
import { Button, Group, NumberInput, Paper, Stack, Text, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `
import { useClockCountDown } from '@gfazioli/mantine-clock';
import { useState } from 'react';

function Demo() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);

  const countdown = useClockCountDown({
    enabled: false, // Start paused
    hours,
    minutes,
    seconds,
    padHours: true,
    padMinutes: true,
    padSeconds: true,
    onCountDownCompleted: () => {
      console.log('Countdown completed!');
      alert('Time\\'s up!');
    },
  });

  return (
    <Paper p="md" withBorder>
      <Title order={4} mb="md">Countdown Timer</Title>
      
      <Text fw={700} size="xl" ta="center" mb="md" 
            c={countdown.isCompleted ? 'red' : countdown.totalMilliseconds < 10000 ? 'orange' : undefined}>
        {countdown.hours}:{countdown.minutes}:{countdown.seconds}
      </Text>
      
      <Text size="sm" c="dimmed" ta="center" mb="md">
        Status: {countdown.isCompleted ? 'Completed!' : countdown.isRunning ? 'Running...' : 'Paused'}
      </Text>
      
      <Group gap="xs" justify="center">
        <Button onClick={countdown.start} disabled={countdown.isRunning || countdown.isCompleted}>
          Start
        </Button>
        <Button onClick={countdown.pause} disabled={!countdown.isRunning} variant="outline">
          Pause
        </Button>
        <Button onClick={countdown.resume} disabled={countdown.isRunning || countdown.isCompleted} variant="light">
          Resume
        </Button>
        <Button onClick={countdown.reset} variant="subtle">
          Reset
        </Button>
      </Group>
    </Paper>
  );
}
`;

function Demo() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);

  const countdown = useClockCountDown({
    enabled: false, // Start paused
    hours,
    minutes,
    seconds,
    padHours: true,
    padMinutes: true,
    padSeconds: true,
    onCountDownCompleted: () => {
      // eslint-disable-next-line no-console
      console.log('Countdown completed!');
      // eslint-disable-next-line no-alert
      alert("Time's up!");
    },
  });

  return (
    <Stack gap="md">
      <Group gap="md">
        <NumberInput
          label="Hours"
          value={hours}
          onChange={(value) => setHours(Number(value) || 0)}
          min={0}
          max={23}
          w={80}
        />
        <NumberInput
          label="Minutes"
          value={minutes}
          onChange={(value) => setMinutes(Number(value) || 0)}
          min={0}
          max={59}
          w={80}
        />
        <NumberInput
          label="Seconds"
          value={seconds}
          onChange={(value) => setSeconds(Number(value) || 0)}
          min={0}
          max={59}
          w={80}
        />
      </Group>

      <Paper p="md" withBorder>
        <Title order={4} mb="md">
          Interactive Countdown Timer
        </Title>

        <Text
          fw={700}
          size="xl"
          ta="center"
          mb="md"
          c={
            countdown.isCompleted
              ? 'red'
              : countdown.totalMilliseconds < 10000
                ? 'orange'
                : undefined
          }
        >
          {countdown.hours}:{countdown.minutes}:{countdown.seconds}
        </Text>

        <Text size="sm" c="dimmed" ta="center" mb="md">
          Status:{' '}
          {countdown.isCompleted ? 'Completed!' : countdown.isRunning ? 'Running...' : 'Paused'}
        </Text>

        <Text size="xs" c="dimmed" ta="center" mb="md">
          Total milliseconds: {countdown.totalMilliseconds.toLocaleString()}
        </Text>

        <Group gap="xs" justify="center" mb="md">
          <Button onClick={countdown.start} disabled={countdown.isRunning || countdown.isCompleted}>
            Start
          </Button>
          <Button onClick={countdown.pause} disabled={!countdown.isRunning} variant="outline">
            Pause
          </Button>
          <Button
            onClick={countdown.resume}
            disabled={countdown.isRunning || countdown.isCompleted}
            variant="light"
          >
            Resume
          </Button>
          <Button onClick={countdown.reset} variant="subtle">
            Reset
          </Button>
        </Group>

        {countdown.isCompleted && (
          <Text size="sm" c="red" ta="center" fw={700}>
            Time's up! 🎉
          </Text>
        )}
      </Paper>
    </Stack>
  );
}

export const interactive: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
