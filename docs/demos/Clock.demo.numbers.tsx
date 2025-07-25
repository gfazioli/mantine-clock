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

export const numbers: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code,
  centered: true,
  controls: [
    // Hour Numbers
    {
      type: 'number',
      prop: 'hourNumbersDistance',
      initialValue: 0.75,
      libraryValue: 0.75,
      min: 0.5,
      max: 0.95,
      step: 0.01,
    },

    // Primary Numbers (12, 3, 6, 9)
    {
      type: 'color',
      prop: 'primaryNumbersColor',
      initialValue: '',
      libraryValue: undefined,
    },
    {
      type: 'number',
      prop: 'primaryNumbersOpacity',
      initialValue: 1,
      libraryValue: 1,
      min: 0,
      max: 1,
      step: 0.01,
    },
    // Secondary Numbers (1, 2, 4, 5, 7, 8, 10, 11)
    {
      type: 'color',
      prop: 'secondaryNumbersColor',
      initialValue: '',
      libraryValue: undefined,
    },
    {
      type: 'number',
      prop: 'secondaryNumbersOpacity',
      initialValue: 1,
      libraryValue: 1,
      min: 0,
      max: 1,
      step: 0.01,
    },
  ],
};
