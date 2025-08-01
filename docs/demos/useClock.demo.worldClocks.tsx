import { useClock } from '@gfazioli/mantine-clock';
import { Group, Paper, Stack, Text, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `
import { useClock } from '@gfazioli/mantine-clock';

function Demo() {
  
  const newYork = useClock({ 
    timezone: 'America/New_York', 
    use24Hours: false,
    padHours: true,
    padMinutes: true,
    padSeconds: true,
  });
  const london = useClock({ 
    timezone: 'Europe/London', 
    use24Hours: false,
    padHours: true,
    padMinutes: true,
    padSeconds: true,
  });
  const tokyo = useClock({ 
    timezone: 'Asia/Tokyo', 
    use24Hours: false,
    padHours: true,
    padMinutes: true,
    padSeconds: true,
  });
  const sydney = useClock({ 
    timezone: 'Australia/Sydney', 
    use24Hours: false,
    padHours: true,
    padMinutes: true,
    padSeconds: true,
  });

  const ClockCard = ({ clock, city }: { clock: any; city: string }) => (
    <Paper p="md" withBorder style={{ textAlign: 'center' }}>
      <Title order={5} mb="xs">{city}</Title>
      <Text fw={700} size="lg">
        {clock.hours}:{clock.minutes}:{clock.seconds} {clock.amPm}
      </Text>
      <Text size="sm" c="dimmed">
        {clock.day}/{clock.month}/{clock.year}
      </Text>
    </Paper>
  );

  return (
    <Stack gap="md">
      <Group gap="md" grow>
        <ClockCard clock={newYork} city="New York" />
        <ClockCard clock={london} city="London" />
        <ClockCard clock={tokyo} city="Tokyo" />
        <ClockCard clock={sydney} city="Sydney" />
      </Group>
    </Stack>
  );
}
`;

function Demo() {
  const newYork = useClock({
    timezone: 'America/New_York',
    use24Hours: false,
    padHours: true,
    padMinutes: true,
    padSeconds: true,
  });
  const london = useClock({
    timezone: 'Europe/London',
    use24Hours: false,
    padHours: true,
    padMinutes: true,
    padSeconds: true,
  });
  const tokyo = useClock({
    timezone: 'Asia/Tokyo',
    use24Hours: false,
    padHours: true,
    padMinutes: true,
    padSeconds: true,
  });
  const sydney = useClock({
    timezone: 'Australia/Sydney',
    use24Hours: false,
    padHours: true,
    padMinutes: true,
    padSeconds: true,
  });

  const ClockCard = ({ clock, city }: { clock: any; city: string }) => (
    <Paper p="md" withBorder style={{ textAlign: 'center' }}>
      <Title order={5} mb="xs">
        {city}
      </Title>
      <Text fw={700} size="lg">
        {clock.hours}:{clock.minutes}:{clock.seconds} {clock.amPm}
      </Text>
      <Text size="sm" c="dimmed">
        {clock.day}/{clock.month}/{clock.year}
      </Text>
    </Paper>
  );

  return (
    <Stack gap="md">
      <Group gap="md" grow>
        <ClockCard clock={newYork} city="New York" />
        <ClockCard clock={london} city="London" />
        <ClockCard clock={tokyo} city="Tokyo" />
        <ClockCard clock={sydney} city="Sydney" />
      </Group>
    </Stack>
  );
}

export const worldClocks: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
