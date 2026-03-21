import { useState } from 'react';
import { Clock } from '@gfazioli/mantine-clock';
import { Button, Stack } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `
import { useState } from 'react';
import { Clock } from '@gfazioli/mantine-clock';
import { Button, Group } from '@mantine/core';

function Demo() {
  const [key, setKey] = useState(0);

  return (
    <Stack align="center" gap="md">
      <Clock
        key={key}
        size={300}
        animateOnMount
        animateOnMountDuration={1500}
      />
      <Button onClick={() => setKey((k) => k + 1)} variant="light">
        Remount Clock
      </Button>
    </Stack>
  );
}
`;

function Demo() {
  const [key, setKey] = useState(0);

  return (
    <Stack align="center" gap="md">
      <Clock key={key} size={300} animateOnMount animateOnMountDuration={1500} />
      <Button onClick={() => setKey((k) => k + 1)} variant="light">
        Remount Clock
      </Button>
    </Stack>
  );
}

export const mountAnimation: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
