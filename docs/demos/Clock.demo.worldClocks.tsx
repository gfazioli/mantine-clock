import { Clock } from '@gfazioli/mantine-clock';
import { Group, Stack, Text } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

function Demo() {
  return (
    <Group grow>
      <Stack align="center">
        <Clock timezone="America/New_York" size={200} />
        <Text fw={600} c="dimmed">
          New York
        </Text>
      </Stack>

      <Stack align="center">
        <Clock timezone="Europe/London" size={200} />
        <Text fw={600} c="dimmed">
          London
        </Text>
      </Stack>

      <Stack align="center">
        <Clock timezone="Asia/Tokyo" size={200} />
        <Text fw={600} c="dimmed">
          Tokyo
        </Text>
      </Stack>
    </Group>
  );
}

const code = `
import { Clock } from '@gfazioli/mantine-clock';
import { Group, Stack, Text } from '@mantine/core';

// This demo showcases the usage of the Clock component from the @gfazioli/mantine-clock package.
// It displays world clocks for different timezones, allowing users to see the current time in various locations.

function Demo() {
  return (
    <Group grow>
      <Stack align="center">
        <Clock timezone="America/New_York" size={200} />
        <Text fw={600} c="dimmed">
          New York
        </Text>
      </Stack>

      <Stack align="center">
        <Clock timezone="Europe/London" size={200} />
        <Text fw={600} c="dimmed">
          London
        </Text>
      </Stack>

      <Stack align="center">
        <Clock timezone="Asia/Tokyo" size={200} />
        <Text fw={600} c="dimmed">
          Tokyo
        </Text>
      </Stack>
    </Group>
  );
}
`;

export const worldClocks: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  //   centered: true,
  defaultExpanded: false,
};
