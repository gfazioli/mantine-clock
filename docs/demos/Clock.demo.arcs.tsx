import { Clock, type ClockProps } from '@gfazioli/mantine-clock';
import { MantineDemo } from '@mantinex/demo';

function Demo(props: ClockProps) {
  return <Clock {...props} />;
}

const code = `
import { Clock } from '@gfazioli/mantine-clock';

function Demo() {
  return (
    <Clock
      withSecondsArc
      secondsArcFrom="12:00:00"
      secondsArcColor="red.6"
      secondsArcOpacity={0.6}
      withMinutesArc
      minutesArcFrom="12:00"
      minutesArcColor="blue.6"
      minutesArcOpacity={0.5}
      withHoursArc
      hoursArcFrom="12:00"
      hoursArcDirection="counterClockwise"
      hoursArcColor="teal.6"
      hoursArcOpacity={0.4}
    />
  );
}
`;

export const arcs: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code,
  centered: true,
  controls: [
    { type: 'boolean', prop: 'withSecondsArc', initialValue: true, libraryValue: false },
    { type: 'string', prop: 'secondsArcFrom', initialValue: '12:00:00', libraryValue: undefined },
    {
      type: 'segmented',
      prop: 'secondsArcDirection',
      initialValue: 'clockwise',
      libraryValue: 'clockwise',
      data: [
        { label: 'Clockwise', value: 'clockwise' },
        { label: 'Counter', value: 'counterClockwise' },
      ],
    },
    { type: 'color', prop: 'secondsArcColor', initialValue: 'red.6', libraryValue: undefined },
    {
      type: 'number',
      prop: 'secondsArcOpacity',
      min: 0,
      max: 1,
      step: 0.01,
      initialValue: 0.6,
      libraryValue: 1,
    },
    {
      type: 'number',
      prop: 'secondHandLength',
      initialValue: 0.68,
      libraryValue: 0.68,
      min: 0.2,
      max: 1,
      step: 0.01,
    },

    { type: 'boolean', prop: 'withMinutesArc', initialValue: true, libraryValue: false },
    { type: 'string', prop: 'minutesArcFrom', initialValue: '12:00', libraryValue: undefined },
    {
      type: 'segmented',
      prop: 'minutesArcDirection',
      initialValue: 'clockwise',
      libraryValue: 'clockwise',
      data: [
        { label: 'Clockwise', value: 'clockwise' },
        { label: 'Counter', value: 'counterClockwise' },
      ],
    },
    { type: 'color', prop: 'minutesArcColor', initialValue: 'blue.6', libraryValue: undefined },
    {
      type: 'number',
      prop: 'minutesArcOpacity',
      min: 0,
      max: 1,
      step: 0.01,
      initialValue: 0.5,
      libraryValue: 1,
    },
    {
      type: 'number',
      prop: 'minuteHandLength',
      initialValue: 0.57,
      libraryValue: 0.57,
      min: 0.2,
      max: 1,
      step: 0.01,
    },

    { type: 'boolean', prop: 'withHoursArc', initialValue: true, libraryValue: false },
    { type: 'string', prop: 'hoursArcFrom', initialValue: '12:00', libraryValue: undefined },
    {
      type: 'segmented',
      prop: 'hoursArcDirection',
      initialValue: 'counterClockwise',
      libraryValue: 'clockwise',
      data: [
        { label: 'Clockwise', value: 'clockwise' },
        { label: 'Counter', value: 'counterClockwise' },
      ],
    },
    { type: 'color', prop: 'hoursArcColor', initialValue: 'teal.6', libraryValue: undefined },
    {
      type: 'number',
      prop: 'hoursArcOpacity',
      min: 0,
      max: 1,
      step: 0.01,
      initialValue: 0.4,
      libraryValue: 1,
    },
    {
      type: 'number',
      prop: 'hourHandLength',
      initialValue: 0.4,
      libraryValue: 0.4,
      min: 0.2,
      max: 1,
      step: 0.01,
    },
  ],
};
