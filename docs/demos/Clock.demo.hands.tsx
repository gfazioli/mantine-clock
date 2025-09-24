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

export const hands: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code,
  centered: true,
  controls: [
    // Hands
    {
      type: 'color',
      prop: 'secondHandColor',
      initialValue: '',
      libraryValue: '',
    },
    {
      type: 'number',
      prop: 'secondHandOpacity',
      initialValue: 1,
      libraryValue: 1,
      min: 0,
      max: 1,
      step: 0.01,
    },
    {
      type: 'number',
      prop: 'secondHandLength',
      initialValue: 0.68,
      libraryValue: 0.68,
      min: 0.2,
      max: 0.8,
      step: 0.01,
    },
    {
      type: 'number',
      prop: 'secondHandSize',
      initialValue: 0.006,
      libraryValue: 0.006,
      min: 0.005,
      max: 0.05,
      step: 0.001,
    },

    // Minute Hand Settings
    {
      type: 'color',
      prop: 'minuteHandColor',
      initialValue: '',
      libraryValue: '',
    },
    {
      type: 'number',
      prop: 'minuteHandOpacity',
      initialValue: 1,
      libraryValue: 1,
      min: 0,
      max: 1,
      step: 0.01,
    },
    {
      type: 'number',
      prop: 'minuteHandSize',
      initialValue: 0.011,
      libraryValue: 0.011,
      min: 0.01,
      max: 0.1,
      step: 0.001,
    },
    {
      type: 'number',
      prop: 'minuteHandLength',
      initialValue: 0.57,
      libraryValue: 0.57,
      min: 0.2,
      max: 0.8,
      step: 0.01,
    },

    // Hour Hand Settings
    {
      type: 'color',
      prop: 'hourHandColor',
      initialValue: '',
      libraryValue: '',
    },
    {
      type: 'number',
      prop: 'hourHandOpacity',
      initialValue: 1,
      libraryValue: 1,
      min: 0,
      max: 1,
      step: 0.01,
    },
    {
      type: 'number',
      prop: 'hourHandSize',
      initialValue: 0.017,
      libraryValue: 0.017,
      min: 0.01,
      max: 0.1,
      step: 0.001,
    },
    {
      type: 'number',
      prop: 'hourHandLength',
      initialValue: 0.4,
      libraryValue: 0.4,
      min: 0.2,
      max: 0.8,
      step: 0.01,
    },
  ],
};
