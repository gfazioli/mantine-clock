import { useState } from 'react';
import { Clock } from '@gfazioli/mantine-clock';
import { Box, Slider, Stack, Text } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `
import { useState } from 'react';
import { Clock } from '@gfazioli/mantine-clock';
import { Box, Slider, Stack, Text } from '@mantine/core';

function Demo() {
  const [containerWidth, setContainerWidth] = useState(400);

  return (
    <Stack gap="md">
      <Text size="sm">Container width: {containerWidth}px</Text>
      <Slider
        value={containerWidth}
        onChange={setContainerWidth}
        min={150}
        max={600}
        step={10}
      />
      <Box
        style={{
          width: containerWidth,
          height: 300,
          border: '1px dashed var(--mantine-color-dimmed)',
          borderRadius: 8,
          margin: '0 auto',
        }}
      >
        <Clock size="auto" />
      </Box>
    </Stack>
  );
}
`;

function Demo() {
  const [containerWidth, setContainerWidth] = useState(400);

  return (
    <Stack gap="md">
      <Text size="sm">Container width: {containerWidth}px</Text>
      <Slider value={containerWidth} onChange={setContainerWidth} min={150} max={600} step={10} />
      <Box
        style={{
          width: containerWidth,
          height: 300,
          border: '1px dashed var(--mantine-color-dimmed)',
          borderRadius: 8,
          margin: '0 auto',
        }}
      >
        <Clock size="auto" />
      </Box>
    </Stack>
  );
}

export const responsiveSize: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
