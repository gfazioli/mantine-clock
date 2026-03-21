import { Clock } from '@gfazioli/mantine-clock';
import { Group, Text } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `
import { Clock } from '@gfazioli/mantine-clock';
import { Group, Text } from '@mantine/core';

function Demo() {
  return (
    <Group justify="center">
      <Clock
        size={300}
        faceContent={
          <Text size="xs" c="dimmed" style={{ marginTop: 80 }}>
            SWISS MADE
          </Text>
        }
      />
    </Group>
  );
}
`;

function Demo() {
  return (
    <Group justify="center">
      <Clock
        size={300}
        faceContent={
          <Text size="xs" c="dimmed" style={{ marginTop: 80 }}>
            SWISS MADE
          </Text>
        }
      />
    </Group>
  );
}

export const faceContentDemo: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
