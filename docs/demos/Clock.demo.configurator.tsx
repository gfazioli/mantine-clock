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

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code,
  centered: true,
  controls: [
    // Basic Settings
    {
      type: 'boolean',
      prop: 'running',
      initialValue: true,
      libraryValue: true,
    },
    {
      type: 'select',
      prop: 'secondHandBehavior',
      initialValue: 'tick',
      libraryValue: 'tick',
      data: [
        { label: 'Tick Every Second', value: 'tick' },
        { label: 'Smooth Movement', value: 'smooth' },
        { label: 'Half-Second Ticks', value: 'tick-half' },
        { label: 'High-Frequency Sweep', value: 'tick-high-freq' },
      ],
    },
    {
      type: 'number',
      prop: 'size',
      initialValue: 350,
      libraryValue: 350,
      min: 100,
      max: 500,
      step: 10,
    },
    {
      type: 'color',
      prop: 'color',
      initialValue: '',
      libraryValue: undefined,
    },
    // Ticks Settings
    {
      type: 'color',
      prop: 'hourTicksColor',
      initialValue: 'dark',
      libraryValue: 'dark',
    },
    {
      type: 'number',
      prop: 'hourTicksOpacity',
      initialValue: 1,
      libraryValue: 1,
      min: 0,
      max: 1,
      step: 0.01,
    },
    {
      type: 'color',
      prop: 'minuteTicksColor',
      initialValue: 'gray',
      libraryValue: 'gray',
    },
    {
      type: 'number',
      prop: 'minuteTicksOpacity',
      initialValue: 1,
      libraryValue: 1,
      min: 0,
      max: 1,
      step: 0.01,
    },
  ],
};
