import { Clock, type ClockProps } from '@gfazioli/mantine-clock';
import { MantineDemo } from '@mantinex/demo';

function Demo(props: ClockProps) {
  return <Clock {...props} />;
}

const code = `
import { Clock } from '@gfazioli/mantine-clock';

function Demo() {
  return (
    <Clock{{props}} />
  );
}
`;

export const timezone: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code,
  centered: true,
  controls: [
    // Timezone Settings
    {
      type: 'select',
      prop: 'timezone',
      initialValue: 'UTC',
      libraryValue: '',
      data: [
        { label: 'Local Time', value: '' },
        { label: 'UTC', value: 'UTC' },
        { label: 'New York (EST/EDT)', value: 'America/New_York' },
        { label: 'Los Angeles (PST/PDT)', value: 'America/Los_Angeles' },
        { label: 'Chicago (CST/CDT)', value: 'America/Chicago' },
        { label: 'Denver (MST/MDT)', value: 'America/Denver' },
        { label: 'Toronto', value: 'America/Toronto' },
        { label: 'São Paulo', value: 'America/Sao_Paulo' },
        { label: 'Mexico City', value: 'America/Mexico_City' },
        { label: 'London', value: 'Europe/London' },
        { label: 'Berlin', value: 'Europe/Berlin' },
        { label: 'Paris', value: 'Europe/Paris' },
        { label: 'Rome', value: 'Europe/Rome' },
        { label: 'Madrid', value: 'Europe/Madrid' },
        { label: 'Amsterdam', value: 'Europe/Amsterdam' },
        { label: 'Stockholm', value: 'Europe/Stockholm' },
        { label: 'Moscow', value: 'Europe/Moscow' },
        { label: 'Tokyo', value: 'Asia/Tokyo' },
        { label: 'Shanghai', value: 'Asia/Shanghai' },
        { label: 'Singapore', value: 'Asia/Singapore' },
        { label: 'Hong Kong', value: 'Asia/Hong_Kong' },
        { label: 'Seoul', value: 'Asia/Seoul' },
        { label: 'Mumbai', value: 'Asia/Kolkata' },
        { label: 'Dubai', value: 'Asia/Dubai' },
        { label: 'Sydney', value: 'Australia/Sydney' },
        { label: 'Melbourne', value: 'Australia/Melbourne' },
        { label: 'Auckland', value: 'Pacific/Auckland' },
      ],
    },
  ],
};
