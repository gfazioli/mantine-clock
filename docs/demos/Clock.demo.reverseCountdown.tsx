import { useState } from 'react';
import { Clock, useClockCountDown } from '@gfazioli/mantine-clock';
import { Button, Group, NumberInput, Paper, Stack, Text, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `
import { useState } from 'react';
import { Clock, useClockCountDown } from '@gfazioli/mantine-clock';
import { Button, Group, NumberInput, Paper, Stack, Text } from '@mantine/core';

function Demo() {
  const [hours, setHours] = useState(2);
  const [minutes, setMinutes] = useState(30);
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
    },
  });

  // Format the countdown time for the Clock component
  const countdownValue = \`\${countdown.hours}:\${countdown.minutes}:\${countdown.seconds}\`;

  return (
    <Paper p="md" withBorder>
      <Group align="flex-start" gap="xl">
        {/* Clock showing countdown time */}
        <Stack align="center" gap="md">
          <Clock
            value={countdownValue}
            running={false}
            size={300}
            primaryNumbersProps={{ c: countdown.isCompleted ? 'red.6' : 'blue.6', fw: 600 }}
            secondHandColor={countdown.isCompleted ? 'red.6' : 'blue.6'}
            minuteHandColor={countdown.isCompleted ? 'red.6' : 'blue.6'}
            hourHandColor={countdown.isCompleted ? 'red.6' : 'blue.6'}
          />
          <Text size="sm" c="dimmed" ta="center">
            Reverse Clock
            <br />
            {countdown.isCompleted ? 'Time Up!' : 'Counting Down'}
          </Text>
        </Stack>

        {/* Controls */}
        <Stack gap="md" flex={1}>
          <Title order={4}>Countdown Settings</Title>
          
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

          <Text fw={700} size="lg" ta="center" 
                c={countdown.isCompleted ? 'red' : countdown.totalMilliseconds < 10000 ? 'orange' : undefined}>
            {countdown.hours}:{countdown.minutes}:{countdown.seconds}
          </Text>
          
          <Text size="sm" c="dimmed" ta="center">
            Status: {countdown.isCompleted ? 'Completed!' : countdown.isRunning ? 'Running...' : 'Paused'}
          </Text>

          <Group justify="center" gap="sm">
            <Button 
              onClick={countdown.start} 
              disabled={countdown.isRunning || countdown.isCompleted}
              variant="filled"
            >
              Start
            </Button>
            <Button 
              onClick={countdown.pause} 
              disabled={!countdown.isRunning}
              variant="outline"
            >
              Pause
            </Button>
            <Button 
              onClick={countdown.resume} 
              disabled={countdown.isRunning || countdown.isCompleted}
              variant="outline"
            >
              Resume
            </Button>
            <Button 
              onClick={countdown.reset}
              variant="light"
            >
              Reset
            </Button>
          </Group>
        </Stack>
      </Group>
    </Paper>
  );
}
`;

function Demo() {
  const [hours, setHours] = useState(2);
  const [minutes, setMinutes] = useState(30);
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
    },
  });

  // Format the countdown time for the Clock component
  const countdownValue = `${countdown.hours}:${countdown.minutes}:${countdown.seconds}`;

  return (
    <Paper p="md" withBorder>
      <Group align="flex-start" gap="xl">
        {/* Clock showing countdown time */}
        <Stack align="center" gap="md">
          <Clock
            value={countdownValue}
            running={false}
            size={300}
            primaryNumbersProps={{ c: countdown.isCompleted ? 'red.6' : 'blue.6', fw: 600 }}
            secondHandColor={countdown.isCompleted ? 'red.6' : 'blue.6'}
            minuteHandColor={countdown.isCompleted ? 'red.6' : 'blue.6'}
            hourHandColor={countdown.isCompleted ? 'red.6' : 'blue.6'}
          />
          <Text size="sm" c="dimmed" ta="center">
            Reverse Clock
            <br />
            {countdown.isCompleted ? 'Time Up!' : 'Counting Down'}
          </Text>
        </Stack>

        {/* Controls */}
        <Stack gap="md" flex={1}>
          <Title order={4}>Countdown Settings</Title>

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

          <Text
            fw={700}
            size="lg"
            ta="center"
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

          <Text size="sm" c="dimmed" ta="center">
            Status:{' '}
            {countdown.isCompleted ? 'Completed!' : countdown.isRunning ? 'Running...' : 'Paused'}
          </Text>

          <Group justify="center" gap="sm">
            <Button
              onClick={countdown.start}
              disabled={countdown.isRunning || countdown.isCompleted}
              variant="filled"
            >
              Start
            </Button>
            <Button onClick={countdown.pause} disabled={!countdown.isRunning} variant="outline">
              Pause
            </Button>
            <Button
              onClick={countdown.resume}
              disabled={countdown.isRunning || countdown.isCompleted}
              variant="outline"
            >
              Resume
            </Button>
            <Button onClick={countdown.reset} variant="light">
              Reset
            </Button>
          </Group>
        </Stack>
      </Group>
    </Paper>
  );
}

export const reverseCountdown: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
