import { Clock } from '@gfazioli/mantine-clock';
import { Group, Stack, Text } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

function Demo() {
  return (
    <Group justify="center" gap="xl">
      <Stack align="center" gap="sm">
        <Clock
          value="08:00:00"
          size={200}
          secondHandBehavior="smooth"
          primaryNumbersProps={{ c: 'green.6', fw: 600 }}
        />
        <Text size="sm" c="dimmed" ta="center">
          Starts at 08:00
          <br />
          (smooth animation)
        </Text>
      </Stack>

      <Stack align="center" gap="sm">
        <Clock
          value="14:30:45"
          size={200}
          secondHandBehavior="tick"
          primaryNumbersProps={{ c: 'violet.6', fw: 600 }}
          secondHandColor="violet.6"
        />
        <Text size="sm" c="dimmed" ta="center">
          Starts at 14:30:45
          <br />
          (tick animation)
        </Text>
      </Stack>

      <Stack align="center" gap="sm">
        <Clock
          value={new Date(2024, 0, 1, 16, 15, 30)}
          size={200}
          secondHandBehavior="tick-half"
          primaryNumbersProps={{ c: 'orange.6', fw: 600 }}
        />
        <Text size="sm" c="dimmed" ta="center">
          From Date Object
          <br />
          (half-tick animation)
        </Text>
      </Stack>
    </Group>
  );
}

const code = `
import { Clock } from '@gfazioli/mantine-clock';
import { Group, Stack, Text } from '@mantine/core';

function Demo() {
  return (
    <Group justify="center" gap="xl">
      <Stack align="center" gap="sm">
        <Clock 
          value="08:00:00" 
          size={200}
          secondHandBehavior="smooth"
          primaryNumbersProps={{ c: 'green.6', fw: 600 }}
        />
        <Text size="sm" c="dimmed" ta="center">
          Starts at 08:00
          <br />
          (smooth animation)
        </Text>
      </Stack>

      <Stack align="center" gap="sm">
        <Clock 
          value="14:30:45" 
          size={200}
          secondHandBehavior="tick"
          primaryNumbersProps={{ c: 'violet.6', fw: 600 }}
          secondHandColor="violet.6"
        />
        <Text size="sm" c="dimmed" ta="center">
          Starts at 14:30:45
          <br />
          (tick animation)
        </Text>
      </Stack>

      <Stack align="center" gap="sm">
        <Clock 
          value={new Date(2024, 0, 1, 16, 15, 30)} 
          size={200}
          secondHandBehavior="tick-half"
          primaryNumbersProps={{ c: 'orange.6', fw: 600 }}
        />
        <Text size="sm" c="dimmed" ta="center">
          From Date Object
          <br />
          (half-tick animation)
        </Text>
      </Stack>
    </Group>
  );
}
`;

export const runningValue: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  defaultExpanded: false,
};
