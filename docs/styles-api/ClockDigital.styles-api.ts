import type { ClockDigitalFactory } from '../../package/src/ClockDigital';
import type { StylesApiData } from '../components/styles-api.types';

export const ClockDigitalStylesApi: StylesApiData<ClockDigitalFactory> = {
  selectors: {
    root: 'Root element',
    segment: 'Individual time segment (hours, minutes, seconds)',
    hours: 'Hours segment',
    separator: 'Separator character between segments',
    minutes: 'Minutes segment',
    seconds: 'Seconds segment',
    amPm: 'AM/PM indicator',
    date: 'Date display',
  },

  vars: {
    root: {
      '--clock-digital-size': 'Font size of the clock',
      '--clock-digital-color': 'Text color of the clock',
      '--clock-digital-font-family': 'Font family',
      '--clock-digital-gap': 'Gap between segments',
    },
  },

  modifiers: [],
};
