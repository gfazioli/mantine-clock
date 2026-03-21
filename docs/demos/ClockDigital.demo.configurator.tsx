import { Clock, type ClockDigitalProps } from '@gfazioli/mantine-clock';
import { MantineDemo } from '@mantinex/demo';

function Demo(props: ClockDigitalProps) {
  return <Clock.Digital {...props} />;
}

const code = `
import { Clock } from '@gfazioli/mantine-clock';

function Demo() {
  return (
    <Clock.Digital{{props}} />
  );
}
`;

export const digitalConfigurator: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code,
  centered: true,
  controls: [
    { type: 'size', prop: 'size', initialValue: 'md', libraryValue: 'md' },
    {
      type: 'color',
      prop: 'color',
      initialValue: '',
      libraryValue: '',
    },
    {
      type: 'boolean',
      prop: 'use24Hours',
      initialValue: true,
      libraryValue: true,
    },
    {
      type: 'boolean',
      prop: 'showSeconds',
      initialValue: true,
      libraryValue: true,
    },
    {
      type: 'boolean',
      prop: 'showDate',
      initialValue: false,
      libraryValue: false,
    },
    {
      type: 'boolean',
      prop: 'showAmPm',
      initialValue: true,
      libraryValue: true,
    },
    {
      type: 'string',
      prop: 'separator',
      initialValue: ':',
      libraryValue: ':',
    },
  ],
};
