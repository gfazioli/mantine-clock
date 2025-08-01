import { Clock } from '@gfazioli/mantine-clock';
import { Group, Stack, Text } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

function Demo() {
  return (
    <Group justify="center" gap="xl">
      <Stack align="center" gap="sm">
        <Clock running={false} size={200} primaryNumbersProps={{ c: 'gray.6', fw: 600 }} />
        <Text size="sm" c="dimmed" ta="center">
          Default Static
          <br />
          (Current Time)
        </Text>
      </Stack>

      <Stack align="center" gap="sm">
        <Clock
          running={false}
          value="15:30"
          size={200}
          primaryNumbersProps={{ c: 'blue.6', fw: 600 }}
        />
        <Text size="sm" c="dimmed" ta="center">
          Static Time
          <br />
          15:30
        </Text>
      </Stack>

      <Stack align="center" gap="sm">
        <Clock
          running={false}
          value="09:45:30"
          size={200}
          primaryNumbersProps={{ c: 'red.6', fw: 600 }}
          secondHandColor="red.6"
        />
        <Text size="sm" c="dimmed" ta="center">
          With Seconds
          <br />
          09:45:30
        </Text>
      </Stack>

      <Stack align="center" gap="sm">
        <Clock
          running={false}
          value={new Date(2024, 0, 1, 11, 25, 15)}
          size={200}
          primaryNumbersProps={{ c: 'teal.6', fw: 600 }}
        />
        <Text size="sm" c="dimmed" ta="center">
          Date Object
          <br />
          11:25:15
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
          running={false} 
          size={200}
          primaryNumbersProps={{ c: 'gray.6', fw: 600 }}
        />
        <Text size="sm" c="dimmed" ta="center">
          Default Static
          <br />
          (Current Time)
        </Text>
      </Stack>

      <Stack align="center" gap="sm">
        <Clock 
          running={false} 
          value="15:30" 
          size={200}
          primaryNumbersProps={{ c: 'blue.6', fw: 600 }}
        />
        <Text size="sm" c="dimmed" ta="center">
          Static Time
          <br />
          15:30
        </Text>
      </Stack>

      <Stack align="center" gap="sm">
        <Clock 
          running={false} 
          value="09:45:30" 
          size={200}
          primaryNumbersProps={{ c: 'red.6', fw: 600 }}
          secondHandColor="red.6"
        />
        <Text size="sm" c="dimmed" ta="center">
          With Seconds
          <br />
          09:45:30
        </Text>
      </Stack>

      <Stack align="center" gap="sm">
        <Clock 
          running={false} 
          value={new Date(2024, 0, 1, 11, 25, 15)} 
          size={200}
          primaryNumbersProps={{ c: 'teal.6', fw: 600 }}
        />
        <Text size="sm" c="dimmed" ta="center">
          Date Object
          <br />
          11:25:15
        </Text>
      </Stack>
    </Group>
  );
}
`;

export const staticValue: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  defaultExpanded: false,
};
