import { Clock } from '@gfazioli/mantine-clock';
import { Group } from '@mantine/core';
import { MantineDemo } from '@mantinex/demo';

const code = `
import { Clock } from '@gfazioli/mantine-clock';

function Demo() {
  return (
    <Group justify="center">
      <Clock
        size={350}
        renderSecondHand={({ angle, length, centerX, centerY }) => (
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 17,
              pointerEvents: 'none',
            }}
          >
            <line
              x1={centerX}
              y1={centerY}
              x2={centerX + Math.sin((angle * Math.PI) / 180) * length}
              y2={centerY - Math.cos((angle * Math.PI) / 180) * length}
              stroke="var(--mantine-color-red-6)"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <circle
              cx={centerX + Math.sin((angle * Math.PI) / 180) * (length - 10)}
              cy={centerY - Math.cos((angle * Math.PI) / 180) * (length - 10)}
              r={4}
              fill="var(--mantine-color-red-6)"
            />
          </svg>
        )}
      />
    </Group>
  );
}
`;

function Demo() {
  return (
    <Group justify="center">
      <Clock
        size={350}
        renderSecondHand={({ angle, length, centerX, centerY }) => (
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 17,
              pointerEvents: 'none',
            }}
          >
            <line
              x1={centerX}
              y1={centerY}
              x2={centerX + Math.sin((angle * Math.PI) / 180) * length}
              y2={centerY - Math.cos((angle * Math.PI) / 180) * length}
              stroke="var(--mantine-color-red-6)"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <circle
              cx={centerX + Math.sin((angle * Math.PI) / 180) * (length - 10)}
              cy={centerY - Math.cos((angle * Math.PI) / 180) * (length - 10)}
              r={4}
              fill="var(--mantine-color-red-6)"
            />
          </svg>
        )}
      />
    </Group>
  );
}

export const customHands: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
