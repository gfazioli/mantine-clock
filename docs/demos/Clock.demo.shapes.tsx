import { Clock } from '@gfazioli/mantine-clock';
import { Group } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `
import { Clock } from '@gfazioli/mantine-clock';

function Demo() {
  return (
    <Group gap="xl" align="flex-start">
      {/* Default circle */}
      <Clock size={200} />

      {/* Rounded rectangle (Apple Watch style) */}
      <Clock
        size={200}
        shape="rounded-rect"
        borderRadius={40}
      />

      {/* Taller aspect ratio */}
      <Clock
        size={200}
        shape="rounded-rect"
        aspectRatio={1.2}
        borderRadius={30}
      />
    </Group>
  );
}
`;

function Demo() {
  return (
    <Group gap="xl" align="flex-start">
      <Clock size={200} />
      <Clock size={200} shape="rounded-rect" borderRadius={40} />
      <Clock size={200} shape="rounded-rect" aspectRatio={1.2} borderRadius={30} />
    </Group>
  );
}

export const shapes: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
