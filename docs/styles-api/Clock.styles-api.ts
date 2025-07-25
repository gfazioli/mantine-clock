import type { ClockFactory } from '../../package/src/Clock';
import type { StylesApiData } from '../components/styles-api.types';

export const ClockStylesApi: StylesApiData<ClockFactory> = {
  selectors: {
    root: 'Root element of the clock component',
    clockContainer: 'Main clock container',
    glassWrapper: 'Glass wrapper with shadow effects',
    clockFace: 'Clock face containing all visual elements',
    hourMarks: 'Container for hour marks and numbers',
    hourTick: 'Hour tick marks (12 positions)',
    minuteTick: 'Minute tick marks (60 positions, excluding hour positions)',
    number: 'Base styles for hour numbers (1-12)',
    primaryNumber: 'Primary hour numbers (12, 3, 6, 9)',
    secondaryNumber: 'Secondary hour numbers (1, 2, 4, 5, 7, 8, 10, 11)',
    hand: 'Base styles for clock hands',
    hourHand: 'Hour hand specific styles',
    minuteHand: 'Minute hand specific styles',
    secondHandContainer: 'Container for second hand and counterweight',
    secondHand: 'Second hand specific styles',
    secondHandCounterweight: 'Second hand counterweight',
    centerBlur: 'Center blur effect',
    centerDot: 'Center dot at the pivot point',
  },

  vars: {
    root: {
      '--clock-size': 'Size of the clock',
      '--clock-color': 'Main color of the clock face',
      '--clock-hour-ticks-color': 'Color of the hour tick marks',
      '--clock-hour-ticks-opacity': 'Opacity of the hour tick marks',
      '--clock-minute-ticks-color': 'Color of the minute tick marks',
      '--clock-minute-ticks-opacity': 'Opacity of the minute tick marks',
      '--clock-primary-numbers-color': 'Color of the primary hour numbers (12, 3, 6, 9)',
      '--clock-primary-numbers-opacity': 'Opacity of the primary hour numbers',
      '--clock-secondary-numbers-color':
        'Color of the secondary hour numbers (1, 2, 4, 5, 7, 8, 10, 11)',
      '--clock-secondary-numbers-opacity': 'Opacity of the secondary hour numbers',
      '--clock-second-hand-color': 'Color of the second hand',
      '--clock-minute-hand-color': 'Color of the minute hand',
      '--clock-hour-hand-color': 'Color of the hour hand',
    },
  },

  modifiers: [],
};
