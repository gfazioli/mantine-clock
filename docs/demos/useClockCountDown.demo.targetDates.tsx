import { useClockCountDown } from '@gfazioli/mantine-clock';
import { Button, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `
import { useClockCountDown } from '@gfazioli/mantine-clock';

function Demo() {
  // Countdown to New Year 2026
  const newYear = useClockCountDown({
    enabled: false,
    targetDate: '2026-01-01T00:00:00Z',
    timezone: 'UTC',
    padHours: true,
    padMinutes: true,
    padSeconds: true,
  });

  // Halloween countdown (October 31, 2025)
  const halloween = useClockCountDown({
    enabled: false,
    targetDate: '2025-10-31T00:00:00Z',
    timezone: 'Europe/Rome',
    padHours: true,
    padMinutes: true,
    padSeconds: true,
  });

  const CountdownCard = ({ 
    countdown, 
    title, 
    emoji 
  }: { 
    countdown: any; 
    title: string; 
    emoji: string;
  }) => (
    <Paper p="md" withBorder style={{ textAlign: 'center' }}>
      <Title order={5} mb="xs">{emoji} {title}</Title>
      {countdown.isCompleted ? (
        <Text fw={700} size="lg" c="green">
          🎉 Event has arrived! 🎉
        </Text>
      ) : (
        <>
          <Text fw={700} size="lg" mb="xs">
            {countdown.day}d {countdown.hours}:{countdown.minutes}:{countdown.seconds}
          </Text>
          <Text size="sm" c="dimmed">
            {countdown.month} months, {countdown.day} days
          </Text>
        </>
      )}
    </Paper>
  );

  const allStopped = !newYear.isRunning && !halloween.isRunning;
  const allCompleted = newYear.isCompleted && halloween.isCompleted;

  return (
    <Stack gap="md">
      <Button 
        onClick={() => {
          if (allStopped) {
            newYear.start();
            halloween.start();
          } else {
            newYear.pause();
            halloween.pause();
          }
        }}
        variant={allStopped ? 'outline' : 'filled'}
        disabled={allCompleted}
      >
        {allStopped ? 'Start Countdowns' : 'Stop Countdowns'}
      </Button>
      
      <Group gap="md" grow>
        <CountdownCard countdown={newYear} title="New Year 2026" emoji="🎊" />
        <CountdownCard countdown={halloween} title="Halloween 2025" emoji="🎃" />
      </Group>
    </Stack>
  );
}
`;

function Demo() {
  // Countdown to New Year 2026
  const newYear = useClockCountDown({
    enabled: false,
    targetDate: '2026-01-01T00:00:00Z',
    timezone: 'UTC',
    padHours: true,
    padMinutes: true,
    padSeconds: true,
  });

  // Halloween countdown (October 31, 2025)
  const halloween = useClockCountDown({
    enabled: false,
    targetDate: '2025-10-31T00:00:00Z',
    timezone: 'Europe/Rome',
    padHours: true,
    padMinutes: true,
    padSeconds: true,
  });

  const CountdownCard = ({
    countdown,
    title,
    emoji,
  }: {
    countdown: any;
    title: string;
    emoji: string;
  }) => (
    <Paper p="md" withBorder style={{ textAlign: 'center' }}>
      <Title order={5} mb="xs">
        {emoji} {title}
      </Title>
      {countdown.isCompleted ? (
        <Text fw={700} size="lg" c="green">
          🎉 Event has arrived! 🎉
        </Text>
      ) : (
        <>
          <Text fw={700} size="lg" mb="xs">
            {countdown.day}d {countdown.hours}:{countdown.minutes}:{countdown.seconds}
          </Text>
          <Text size="sm" c="dimmed">
            {countdown.month} months, {countdown.day} days
          </Text>
        </>
      )}
    </Paper>
  );

  const allStopped = !newYear.isRunning && !halloween.isRunning;
  const allCompleted = newYear.isCompleted && halloween.isCompleted;

  return (
    <Stack gap="md">
      <Button
        onClick={() => {
          if (allStopped) {
            newYear.start();
            halloween.start();
          } else {
            newYear.pause();
            halloween.pause();
          }
        }}
        variant={allStopped ? 'outline' : 'filled'}
        disabled={allCompleted}
      >
        {allStopped ? 'Start Countdowns' : 'Stop Countdowns'}
      </Button>

      <Group gap="md" grow>
        <CountdownCard countdown={newYear} title="New Year 2026" emoji="🎊" />
        <CountdownCard countdown={halloween} title="Halloween 2025" emoji="🎃" />
      </Group>
    </Stack>
  );
}

export const targetDates: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
