import { useEffect, useState } from 'react';
import { Clock, useClock } from '@gfazioli/mantine-clock';
import { Button, Group, NumberInput, Paper, Stack, Text, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `
import { useEffect, useState } from 'react';
import { Clock, useClock } from '@gfazioli/mantine-clock';
import { Button, Group, NumberInput, Paper, Stack, Text, Title } from '@mantine/core';

function Demo() {
  // Inputs to set a specific starting time
  const [hours, setHours] = useState(10);
  const [minutes, setMinutes] = useState(15);
  const [seconds, setSeconds] = useState(0);

  // Displayed time (driven by a metronome from useClock)
  const [display, setDisplay] = useState({ h: hours, m: minutes, s: seconds });

  // Use useClock purely as a ticker/controls (does not dictate displayed time)
  const clock = useClock({
    enabled: false, // start paused
    updateFrequency: 1000,
    padHours: true,
    padMinutes: true,
    padSeconds: true,
  });

  // When inputs change and we're paused, reflect them immediately on the display
  useEffect(() => {
    if (!clock.isRunning) {
      setDisplay({ h: hours, m: minutes, s: seconds });
    }
  }, [hours, minutes, seconds, clock.isRunning]);

  // Advance the displayed time by one second on each tick while running
  useEffect(() => {
    if (!clock.isRunning) return;
    setDisplay((prev) => {
      let s = prev.s + 1;
      let m = prev.m;
      let h = prev.h;
      if (s >= 60) {
        s = 0;
        m += 1;
        if (m >= 60) {
          m = 0;
          h = (h + 1) % 24;
        }
      }
      return { h, m, s };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clock.seconds]);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const value = pad(display.h) + ':' + pad(display.m) + ':' + pad(display.s);

  return (
    <Paper p="md" withBorder>
      <Group align="flex-start" gap="xl">
        {/* Analog clock showing the set/running time */}
        <Stack align="center" gap="md">
          <Clock value={value} running={false} size={300} />
          <Text size="sm" c="dimmed" ta="center">
            Set a specific time, then Start/Pause/Resume
          </Text>
        </Stack>

        {/* Controls */}
        <Stack gap="md" flex={1}>
          <Title order={4}>Specific Time</Title>

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

          <Text fw={700} size="lg" ta="center">
            {pad(display.h)}:{pad(display.m)}:{pad(display.s)}
          </Text>

          <Text size="sm" c="dimmed" ta="center">
            Status: {clock.isRunning ? 'Running' : 'Paused'}
          </Text>

          <Group justify="center" gap="sm">
            <Button onClick={clock.start} disabled={clock.isRunning} variant="filled">
              Start
            </Button>
            <Button onClick={clock.pause} disabled={!clock.isRunning} variant="outline">
              Pause
            </Button>
            <Button onClick={clock.resume} disabled={clock.isRunning} variant="outline">
              Resume
            </Button>
            <Button
              onClick={() => {
                clock.reset();
                setDisplay({ h: hours, m: minutes, s: seconds });
              }}
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
  // Inputs to set a specific starting time
  const [hours, setHours] = useState(10);
  const [minutes, setMinutes] = useState(15);
  const [seconds, setSeconds] = useState(0);

  // Displayed time (driven by a metronome from useClock)
  const [dHours, setDHours] = useState(hours);
  const [dMinutes, setDMinutes] = useState(minutes);
  const [dSeconds, setDSeconds] = useState(seconds);

  // Use useClock purely as a ticker/controls (does not dictate displayed time)
  const clock = useClock({
    enabled: false, // start paused
    updateFrequency: 1000,
    padHours: true,
    padMinutes: true,
    padSeconds: true,
  });

  // When inputs change and we're paused, reflect them immediately on the display
  useEffect(() => {
    if (!clock.isRunning) {
      setDHours(hours);
      setDMinutes(minutes);
      setDSeconds(seconds);
    }
  }, [hours, minutes, seconds, clock.isRunning]);

  // Advance the displayed time by one second on each tick while running
  useEffect(() => {
    if (!clock.isRunning) return;
    setDSeconds((prev) => {
      let s = prev + 1;
      let m = dMinutes;
      let h = dHours;
      if (s >= 60) {
        s = 0;
        m += 1;
        if (m >= 60) {
          m = 0;
          h = (h + 1) % 24;
        }
      }
      setDMinutes(m);
      setDHours(h);
      return s;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clock.seconds]);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const value = `${pad(dHours)}:${pad(dMinutes)}:${pad(dSeconds)}`;

  return (
    <Paper p="md" withBorder>
      <Group align="flex-start" gap="xl">
        {/* Analog clock showing the set/running time */}
        <Stack align="center" gap="md">
          <Clock value={value} running={false} size={300} />
          <Text size="sm" c="dimmed" ta="center">
            Set a specific time, then Start/Pause/Resume
          </Text>
        </Stack>

        {/* Controls */}
        <Stack gap="md" flex={1}>
          <Title order={4}>Specific Time</Title>

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

          <Text fw={700} size="lg" ta="center">
            {pad(dHours)}:{pad(dMinutes)}:{pad(dSeconds)}
          </Text>

          <Text size="sm" c="dimmed" ta="center">
            Status: {clock.isRunning ? 'Running' : 'Paused'}
          </Text>

          <Group justify="center" gap="sm">
            <Button onClick={clock.start} disabled={clock.isRunning} variant="filled">
              Start
            </Button>
            <Button onClick={clock.pause} disabled={!clock.isRunning} variant="outline">
              Pause
            </Button>
            <Button onClick={clock.resume} disabled={clock.isRunning} variant="outline">
              Resume
            </Button>
            <Button
              onClick={() => {
                clock.reset();
                setDHours(hours);
                setDMinutes(minutes);
                setDSeconds(seconds);
              }}
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

export const specificTime: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
