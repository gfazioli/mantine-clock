import { Clock } from '@gfazioli/mantine-clock';
import { Text } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `
import { Clock } from '@gfazioli/mantine-clock';
import { Text } from '@mantine/core';

function Demo() {
  return (
    <Clock
      size={300}
      faceContent={
        <Text size="xs" c="dimmed" style={{ marginTop: 80 }}>
          SWISS MADE
        </Text>
      }
    />
  );
}
`;

function Demo() {
  return (
    <Clock
      size={300}
      faceContent={
        <Text size="xs" c="dimmed" style={{ marginTop: 80 }}>
          SWISS MADE
        </Text>
      }
    />
  );
}

export const faceContentDemo: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
