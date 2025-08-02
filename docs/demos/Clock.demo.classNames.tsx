import { Clock } from '@gfazioli/mantine-clock';
import { Stack, Text, Title } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';
import classes from './Clock.demo.classNames.module.css';

const code = `
import { Clock } from '@gfazioli/mantine-clock';
import { Stack, Text, Title } from '@mantine/core';
import classes from './Clock.demo.classNames.module.css';

function Demo() {
  return (
    <Stack align="center" justify="center">
      <Title order={4} ta="center" mb="xs">
        Neon Cyber Clock Theme
      </Title>
      <Text size="sm" c="dimmed" ta="center" mb="md">
        Custom styling using CSS modules and classNames prop
      </Text>
      <Clock
        size={200}
        secondHandBehavior="smooth"
        classNames={{
          glassWrapper: classes.glassWrapper,
          clockFace: classes.clockFace,
          hourTick: classes.hourTick,
          minuteTick: classes.minuteTick,
          primaryNumber: classes.primaryNumber,
          secondaryNumber: classes.secondaryNumber,
          hourHand: classes.hourHand,
          minuteHand: classes.minuteHand,
          secondHand: classes.secondHand,
          secondHandCounterweight: classes.secondHandCounterweight,
          centerDot: classes.centerDot,
          centerBlur: classes.centerBlur,
        }}
      />
    </Stack>
  );
}
`;

const cssCode = `
/* Clock.demo.classNames.module.css */

.glassWrapper {
  background: radial-gradient(circle, #1a1a2e 0%, #0f3460 100%);
  animation: neon-pulse 3s ease-in-out infinite;
}

.clockFace {
  background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
}

.hourTick {
  background: linear-gradient(to bottom, #00d4ff, #0099cc);
  width: 4px !important;
}

.minuteTick {
  background: rgba(0, 212, 255, 0.6);
  box-shadow: 0 0 2px rgba(0, 212, 255, 0.3);
}

.primaryNumber {
  color: #00d4ff !important;
  font-weight: 700 !important;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.8);
  font-size: 1.2em !important;
}

.secondaryNumber {
  color: #66b3ff !important;
  font-weight: 500 !important;
  text-shadow: 0 0 5px rgba(102, 179, 255, 0.6);
}

.hourHand {
  background: linear-gradient(to top, #ff6b35, #f7931e) !important;
  box-shadow: 0 0 8px rgba(255, 107, 53, 0.6);
  width: 6px !important;
}

.minuteHand {
  background: linear-gradient(to top, #00d4ff, #0099cc) !important;
  box-shadow: 0 0 8px rgba(0, 212, 255, 0.6);
  width: 4px !important;
}

.secondHand {
  background: linear-gradient(to top, #ff0080, #ff4081) !important;
  box-shadow: 0 0 10px rgba(255, 0, 128, 0.8);
  width: 2px !important;
}

.secondHandCounterweight {
  background: #ff0080 !important;
  box-shadow: 0 0 8px rgba(255, 0, 128, 0.6);
}

.centerDot {
  background: radial-gradient(circle, #ffffff, #00d4ff) !important;
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.8);
  border: 2px solid #ffffff;
}

.centerBlur {
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent) !important;
}

@keyframes neon-pulse {
  0%, 100% { 
    box-shadow: 
      0 0 20px rgba(0, 212, 255, 0.3),
      inset 0 0 20px rgba(0, 212, 255, 0.1);
  }
  50% { 
    box-shadow: 
      0 0 30px rgba(0, 212, 255, 0.5),
      inset 0 0 30px rgba(0, 212, 255, 0.2);
  }
}
`;

function Demo() {
  return (
    <Stack align="center" justify="center">
      <Title order={4} ta="center" mb="xs">
        Neon Cyber Clock Theme
      </Title>
      <Text size="sm" c="dimmed" ta="center" mb="md">
        Custom styling using CSS modules and classNames prop
      </Text>
      <Clock
        size={200}
        secondHandBehavior="smooth"
        classNames={{
          root: classes.root,
          clockContainer: classes.clockContainer,
          glassWrapper: classes.glassWrapper,
          clockFace: classes.clockFace,
          hourTick: classes.hourTick,
          minuteTick: classes.minuteTick,
          primaryNumber: classes.primaryNumber,
          secondaryNumber: classes.secondaryNumber,
          hourHand: classes.hourHand,
          minuteHand: classes.minuteHand,
          secondHand: classes.secondHand,
          secondHandCounterweight: classes.secondHandCounterweight,
          centerDot: classes.centerDot,
          centerBlur: classes.centerBlur,
        }}
      />
    </Stack>
  );
}

export const classNames: MantineDemo = {
  type: 'code',
  component: Demo,
  code: [
    { code, language: 'tsx', fileName: 'Demo.tsx' },
    { code: cssCode, language: 'css', fileName: 'Clock.demo.classNames.module.css' },
  ],
  centered: true,
  defaultExpanded: false,
};
