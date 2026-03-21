import { Clock } from '@gfazioli/mantine-clock';
import { Group, Stack, Text } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `
import { Clock } from '@gfazioli/mantine-clock';

function Demo() {
  return (
    <Stack gap="xl" align="center">
      {/* Default digital clock */}
      <Clock.Digital size="xl" timezone="UTC" />

      {/* 12-hour format with AM/PM */}
      <Clock.Digital
        size="lg"
        timezone="Europe/Rome"
        use24Hours={false}
        showAmPm
      />

      {/* Without seconds, with date */}
      <Clock.Digital
        size="md"
        showSeconds={false}
        showDate
        color="blue"
      />

      {/* Custom separator */}
      <Clock.Digital size="sm" separator=" : " />
    </Stack>
  );
}
`;

function Demo() {
  return (
    <Stack gap="xl" align="center">
      <Group gap="xs">
        <Text size="sm" c="dimmed" w={100}>
          XL / UTC:
        </Text>
        <Clock.Digital size="xl" timezone="UTC" />
      </Group>
      <Group gap="xs">
        <Text size="sm" c="dimmed" w={100}>
          12h / Rome:
        </Text>
        <Clock.Digital size="lg" timezone="Europe/Rome" use24Hours={false} showAmPm />
      </Group>
      <Group gap="xs">
        <Text size="sm" c="dimmed" w={100}>
          No seconds:
        </Text>
        <Clock.Digital size="md" showSeconds={false} showDate color="blue" />
      </Group>
      <Group gap="xs">
        <Text size="sm" c="dimmed" w={100}>
          Custom sep:
        </Text>
        <Clock.Digital size="sm" separator=" : " />
      </Group>
    </Stack>
  );
}

export const digital: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
