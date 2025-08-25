import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Group, Stack, Text } from '@mantine/core';
import { Clock } from './Clock';

const meta: Meta<typeof Clock> = {
  title: 'Glass Clock',
  component: Clock,
  parameters: {
    layout: 'centered',
  },
  args: {
    size: 400,
    color: undefined,
    hourNumbersDistance: 0.75,
    timezone: undefined,
    running: true,
    value: undefined,

    hourTicksColor: undefined,
    hourTicksOpacity: undefined,
    minuteTicksColor: undefined,
    minuteTicksOpacity: undefined,

    primaryNumbersColor: undefined,
    primaryNumbersOpacity: undefined,
    secondaryNumbersColor: undefined,
    secondaryNumbersOpacity: undefined,

    secondHandBehavior: undefined,
    secondHandColor: undefined,
    secondHandOpacity: undefined,
    secondHandLength: 0.68,
    secondHandSize: 0.006,

    minuteHandColor: undefined,
    minuteHandOpacity: 1,
    minuteHandSize: 0.011,
    minuteHandLength: 0.57,

    hourHandColor: undefined,
    hourHandOpacity: 1,
    hourHandSize: 0.017,
    hourHandLength: 0.4,

    // Arcs default (off)
    withSecondsArc: false,
    secondsArcFrom: undefined,
    secondsArcDirection: 'clockwise',
    secondsArcColor: undefined,
    secondsArcOpacity: 1,
    withMinutesArc: false,
    minutesArcFrom: undefined,
    minutesArcDirection: 'clockwise',
    minutesArcColor: undefined,
    minutesArcOpacity: 1,
    withHoursArc: false,
    hoursArcFrom: undefined,
    hoursArcDirection: 'clockwise',
    hoursArcColor: undefined,
    hoursArcOpacity: 1,
  },
  argTypes: {
    timezone: {
      control: { type: 'select' },
      options: [
        undefined,
        'UTC',
        'America/New_York',
        'America/Los_Angeles',
        'America/Chicago',
        'Europe/London',
        'Europe/Berlin',
        'Europe/Paris',
        'Europe/Rome',
        'Asia/Tokyo',
        'Asia/Shanghai',
        'Asia/Singapore',
        'Australia/Sydney',
      ],
      description: 'Timezone for displaying time in different countries',
    },
    running: {
      control: { type: 'boolean' },
      description: 'Whether the clock should update in real time',
    },
    value: {
      control: { type: 'text' },
      description: 'Time value to display (e.g., "10:30", "18:15:07") or date string',
    },
    color: {
      control: { type: 'color' },
      description: 'Mantine color for the minute ticks',
    },
    secondHandOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Opacity for the seconds hand (0 = hidden, 1 = fully visible)',
    },
    secondHandColor: {
      control: { type: 'color' },
      description: 'Mantine color for the minutes hand',
    },
    secondHandLength: {
      control: { type: 'range', min: 0.2, max: 0.8, step: 0.01 },
      description: 'Second hand length as percentage of clock radius',
    },
    minuteHandColor: {
      control: { type: 'color' },
      description: 'Mantine color for the minutes hand',
    },
    minuteHandOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Opacity for the minutes hand (0 = hidden, 1 = fully visible)',
    },
    minuteTicksColor: {
      control: { type: 'color' },
      description: 'Mantine color for the minute ticks',
    },
    minuteTicksOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Opacity for the minute ticks (0 = hidden, 1 = fully visible)',
    },
    minuteHandSize: {
      control: { type: 'range', min: 0.01, max: 0.1, step: 0.001 },
      description: 'Minute hand thickness as percentage of clock size',
    },
    minuteHandLength: {
      control: { type: 'range', min: 0.2, max: 0.8, step: 0.01 },
      description: 'Minute hand length as percentage of clock radius',
    },
    hourHandColor: {
      control: { type: 'color' },
      description: 'Mantine color for the hours hand',
    },
    hourHandOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Opacity for the hours hand (0 = hidden, 1 = fully visible)',
    },
    hourTicksColor: {
      control: { type: 'color' },
      description: 'Mantine color for the hour ticks',
    },
    hourTicksOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Opacity for the hour ticks (0 = hidden, 1 = fully visible)',
    },
    primaryNumbersColor: {
      control: { type: 'color' },
      description: 'Mantine color for the primary hour numbers (12, 3, 6, 9)',
    },
    primaryNumbersOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Opacity for the primary hour numbers (0 = hidden, 1 = fully visible)',
    },
    secondaryNumbersColor: {
      control: { type: 'color' },
      description: 'Mantine color for the secondary hour numbers (1, 2, 4, 5, 7, 8, 10, 11)',
    },
    secondaryNumbersOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Opacity for the secondary hour numbers (0 = hidden, 1 = fully visible)',
    },
    secondHandSize: {
      control: { type: 'range', min: 0.005, max: 0.05, step: 0.001 },
      description: 'Second hand thickness as percentage of clock size',
    },
    hourHandLength: {
      control: { type: 'range', min: 0.2, max: 0.8, step: 0.01 },
    },
    secondHandBehavior: {
      control: { type: 'select' },
      options: ['tick', 'smooth', 'tick-half', 'tick-high-freq'],
      description: 'Second hand movement behavior',
    },
    size: {
      control: { type: 'range', min: 100, max: 800, step: 10 },
      description: 'Clock size in pixels (default: 400px)',
    },

    hourHandSize: {
      control: { type: 'range', min: 0.01, max: 0.1, step: 0.001 },
      description: 'Hour hand thickness as percentage of clock size',
    },

    hourNumbersDistance: {
      control: { type: 'range', min: 0.5, max: 0.95, step: 0.01 },
      description:
        'Distance of the hour numbers from the center as a percentage of the radius (0.5 = 50%, 0.83 = default)',
    },
    // Arcs controls
    withSecondsArc: {
      control: { type: 'boolean' },
      description: 'Toggle seconds arc visibility',
    },
    secondsArcOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Opacity for the seconds arc (0 = hidden, 1 = fully visible)',
    },
    secondsArcFrom: {
      control: { type: 'text' },
      description: 'Start time for seconds arc (e.g., "12:00:00")',
    },
    secondsArcDirection: {
      control: { type: 'inline-radio' },
      options: ['clockwise', 'counterClockwise'],
      description: 'Direction for seconds arc',
    },
    secondsArcColor: {
      control: { type: 'color' },
      description: 'Color for seconds arc (MantineColor)',
    },
    withMinutesArc: {
      control: { type: 'boolean' },
      description: 'Toggle minutes arc visibility',
    },
    minutesArcOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Opacity for the minutes arc (0 = hidden, 1 = fully visible)',
    },
    minutesArcFrom: {
      control: { type: 'text' },
      description: 'Start time for minutes arc (e.g., "12:00")',
    },
    minutesArcDirection: {
      control: { type: 'inline-radio' },
      options: ['clockwise', 'counterClockwise'],
      description: 'Direction for minutes arc',
    },
    minutesArcColor: {
      control: { type: 'color' },
      description: 'Color for minutes arc (MantineColor)',
    },
    withHoursArc: {
      control: { type: 'boolean' },
      description: 'Toggle hours arc visibility',
    },
    hoursArcOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Opacity for the hours arc (0 = hidden, 1 = fully visible)',
    },
    hoursArcFrom: {
      control: { type: 'text' },
      description: 'Start time for hours arc (e.g., "12:00")',
    },
    hoursArcDirection: {
      control: { type: 'inline-radio' },
      options: ['clockwise', 'counterClockwise'],
      description: 'Direction for hours arc',
    },
    hoursArcColor: {
      control: { type: 'color' },
      description: 'Color for hours arc (MantineColor)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Clock>;

// Basic Stories
export const Default: Story = {
  args: {},
};

export const PrimaryNumbersOnly: Story = {
  args: {
    primaryNumbersColor: 'blue',
    primaryNumbersOpacity: 1,
    secondaryNumbersOpacity: 0, // Hide secondary numbers
  },
};

export const SecondaryNumbersOnly: Story = {
  args: {
    primaryNumbersOpacity: 0, // Hide primary numbers
    secondaryNumbersColor: 'gray',
    secondaryNumbersOpacity: 0.7,
  },
};

export const DifferentNumberStyles: Story = {
  args: {
    primaryNumbersColor: 'red',
    primaryNumbersOpacity: 1,
    secondaryNumbersColor: 'gray',
    secondaryNumbersOpacity: 0.5,
  },
};

export const MinimalNumbers: Story = {
  args: {
    primaryNumbersColor: 'dark',
    primaryNumbersOpacity: 0.9,
    secondaryNumbersOpacity: 0, // Only show 12, 3, 6, 9
    minuteTicksOpacity: 0.3,
    hourTicksOpacity: 0.8,
  },
};

export const CustomFonts: Story = {
  args: {
    primaryNumbersProps: {
      size: 'xl',
      fw: 900,
      c: 'blue',
      ff: 'monospace',
    },
    secondaryNumbersProps: {
      size: 'sm',
      fw: 400,
      c: 'gray',
      ff: 'serif',
    },
  },
};

export const ElegantTypography: Story = {
  args: {
    primaryNumbersProps: {
      size: '32px',
      fw: 700,
      ff: 'Georgia, serif',
    },
    secondaryNumbersProps: {
      size: 'md',
      fw: 300,
      c: 'dimmed',
      ff: 'Arial, sans-serif',
      style: { opacity: 0.8 },
    },
  },
};

export const ModernMinimal: Story = {
  args: {
    primaryNumbersProps: {
      size: '48px',
      fw: 100,
      c: 'red.6',
      ff: 'Helvetica Neue, sans-serif',
    },
    secondaryNumbersProps: {
      size: '26px',
      fw: 200,
      c: 'dimmed',
      ff: 'Helvetica Neue, sans-serif',
    },
    hourTicksOpacity: 0.2,
    minuteTicksOpacity: 0.0,
  },
};

export const WorldClocks: Story = {
  render: () => (
    <Group>
      <Stack align="center">
        <Clock size="sm" timezone="America/New_York" />
        <Text>New York</Text>
      </Stack>
      <Stack align="center">
        <Clock timezone="Europe/London" size={200} />
        <Text>London</Text>
      </Stack>
      <Stack align="center">
        <Clock timezone="Asia/Tokyo" size={200} />
        <Text>Tokyo</Text>
      </Stack>
      <Stack align="center">
        <Clock timezone="Australia/Sydney" size={200} />
        <Text>Sydney</Text>
      </Stack>
    </Group>
  ),
};

export const TimezoneComparison: Story = {
  render: () => (
    <Group>
      <Stack align="center">
        <Clock
          size={250}
          timezone="UTC"
          primaryNumbersProps={{ size: 'lg', fw: 600, c: 'blue.6' }}
          secondaryNumbersProps={{ size: 'sm', c: 'gray.6' }}
        />
        <Text>UTC</Text>
      </Stack>
      <Stack align="center">
        <Clock
          size={250}
          timezone="America/Los_Angeles"
          primaryNumbersProps={{ size: 'lg', fw: 600, c: 'orange.6' }}
          secondaryNumbersProps={{ size: 'sm', c: 'gray.6' }}
        />
        <Text>Los Angeles</Text>
      </Stack>
    </Group>
  ),
};

export const NewYorkTime: Story = {
  args: {
    timezone: 'America/New_York',

    primaryNumbersProps: {
      size: 'xl',
      fw: 700,
      c: 'blue.7',
    },
    secondaryNumbersProps: {
      size: 'md',
      c: 'gray.6',
    },
  },
};

export const TokyoTime: Story = {
  args: {
    timezone: 'Asia/Tokyo',

    primaryNumbersProps: {
      size: 'xl',
      fw: 700,
      c: 'red.6',
    },
    secondaryNumbersProps: {
      size: 'md',
      c: 'gray.6',
    },
  },
};

export const LondonTime: Story = {
  args: {
    timezone: 'Europe/London',
    primaryNumbersProps: {
      size: 'xl',
      fw: 700,
      c: 'green.6',
    },
    secondaryNumbersProps: {
      size: 'md',
      c: 'gray.6',
    },
  },
};

// Static Clock Examples
export const StaticClock: Story = {
  args: {
    running: false,
    size: 300,
  },
  parameters: {
    docs: {
      description: {
        story: 'A static clock that shows the current time when no value is provided.',
      },
    },
  },
};

export const StaticTimeString: Story = {
  args: {
    running: false,
    value: '15:30:45',
    size: 300,
    primaryNumbersProps: {
      size: 'lg',
      fw: 600,
      c: 'blue.6',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'A static clock showing a specific time using a string format "15:30:45".',
      },
    },
  },
};

// Arcs stories
export const SecondsArcLive: Story = {
  args: {
    withSecondsArc: true,
    secondsArcFrom: '12:00:00',
    secondsArcDirection: 'clockwise',
    secondsArcColor: 'red.6',
    secondsArcOpacity: 0.6,
  },
};

export const MinutesArcFromNoon: Story = {
  args: {
    withMinutesArc: true,
    minutesArcFrom: '12:00',
    minutesArcDirection: 'clockwise',
    minutesArcColor: 'blue.6',
    minutesArcOpacity: 0.5,
  },
};

export const HoursArcCounterClockwise: Story = {
  args: {
    withHoursArc: true,
    hoursArcFrom: '12:00',
    hoursArcDirection: 'counterClockwise',
    hoursArcColor: 'teal.6',
    hoursArcOpacity: 0.4,
  },
};

export const AllArcs: Story = {
  args: {
    withSecondsArc: true,
    secondsArcFrom: '12:00:00',
    secondsArcColor: 'red.6',
    secondsArcOpacity: 0.6,
    withMinutesArc: true,
    minutesArcFrom: '12:00',
    minutesArcColor: 'blue.6',
    minutesArcOpacity: 0.5,
    withHoursArc: true,
    hoursArcFrom: '12:00',
    hoursArcColor: 'teal.6',
    hoursArcOpacity: 0.4,
  },
};

export const CustomStartTime: Story = {
  args: {
    running: true,
    value: '09:15:30',
    size: 300,
    secondHandBehavior: 'smooth',
    primaryNumbersProps: {
      size: 'lg',
      fw: 600,
      c: 'orange.6',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'A running clock that starts from a custom time (09:15:30) and continues in real time.',
      },
    },
  },
};

export const StaticClockVariations: Story = {
  render: () => (
    <Stack align="center" gap="xl">
      <Text size="xl" fw={700} ta="center">
        Static Clock Examples
      </Text>

      <Group gap="xl" align="center">
        <Stack align="center" gap="sm">
          <Clock running={false} size={200} />
          <Text size="sm" c="dimmed" ta="center">
            Default Static
            <br />
            (Current Time)
          </Text>
        </Stack>

        <Stack align="center" gap="sm">
          <Clock
            running={false}
            value="10:30"
            size={200}
            primaryNumbersProps={{ c: 'blue.6', fw: 600 }}
          />
          <Text size="sm" c="dimmed" ta="center">
            Static 10:30
            <br />
            (no seconds)
          </Text>
        </Stack>

        <Stack align="center" gap="sm">
          <Clock
            running={false}
            value="18:45:15"
            size={200}
            primaryNumbersProps={{ c: 'red.6', fw: 600 }}
            secondHandColor="red.6"
          />
          <Text size="sm" c="dimmed" ta="center">
            Static 18:45:15
            <br />
            (with seconds)
          </Text>
        </Stack>
      </Group>

      <Text size="xl" fw={700} ta="center" mt="xl">
        Running Clock with Custom Start Time
      </Text>

      <Group gap="xl" align="center">
        <Stack align="center" gap="sm">
          <Clock
            value="08:00:00"
            size={200}
            secondHandBehavior="smooth"
            primaryNumbersProps={{ c: 'green.6', fw: 600 }}
          />
          <Text size="sm" c="dimmed" ta="center">
            Starts at 08:00
            <br />
            (smooth animation)
          </Text>
        </Stack>

        <Stack align="center" gap="sm">
          <Clock
            value="14:30:45"
            size={200}
            secondHandBehavior="tick"
            primaryNumbersProps={{ c: 'purple.6', fw: 600 }}
          />
          <Text size="sm" c="dimmed" ta="center">
            Starts at 14:30:45
            <br />
            (tick animation)
          </Text>
        </Stack>
      </Group>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Various examples showing static clocks and running clocks with custom start times.',
      },
    },
  },
};

export const TimeFormatsDemo: Story = {
  render: () => (
    <Stack align="center" gap="xl">
      <Text size="xl" fw={700} ta="center">
        Supported Time Formats
      </Text>

      <Group gap="xl" align="center" justify="center">
        <Stack align="center" gap="sm">
          <Clock running={false} value="09:15" size={180} primaryNumbersProps={{ c: 'cyan.6' }} />
          <Text size="sm" ta="center" fw={500}>
            "09:15"
            <br />
            <Text size="xs" c="dimmed" span>
              Hours:Minutes
            </Text>
          </Text>
        </Stack>

        <Stack align="center" gap="sm">
          <Clock
            running={false}
            value="16:42:33"
            size={180}
            primaryNumbersProps={{ c: 'violet.6' }}
          />
          <Text size="sm" ta="center" fw={500}>
            "16:42:33"
            <br />
            <Text size="xs" c="dimmed" span>
              Hours:Minutes:Seconds
            </Text>
          </Text>
        </Stack>

        <Stack align="center" gap="sm">
          <Clock
            running={false}
            value={new Date(2024, 0, 1, 11, 25, 0)}
            size={180}
            primaryNumbersProps={{ c: 'teal.6' }}
          />
          <Text size="sm" ta="center" fw={500}>
            Date Object
            <br />
            <Text size="xs" c="dimmed" span>
              new Date(...)
            </Text>
          </Text>
        </Stack>
      </Group>
    </Stack>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples of different time formats supported by the value prop.',
      },
    },
  },
};
