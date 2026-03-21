import { Clock } from '@gfazioli/mantine-clock';
import { MantineDemo } from '@mantinex/demo';

const code = `
import { Clock } from '@gfazioli/mantine-clock';

function Demo() {
  return (
    <Clock
      size={350}
      sectors={[
        { from: '09:00', to: '10:30', color: 'rgba(59, 130, 246, 0.3)', label: 'Meeting' },
        { from: '12:00', to: '13:00', color: 'rgba(34, 197, 94, 0.3)', label: 'Lunch' },
        { from: '14:00', to: '16:00', color: 'rgba(249, 115, 22, 0.3)', label: 'Focus Time' },
      ]}
    />
  );
}
`;

function Demo() {
  return (
    <Clock
      size={350}
      sectors={[
        { from: '09:00', to: '10:30', color: 'rgba(59, 130, 246, 0.3)', label: 'Meeting' },
        { from: '12:00', to: '13:00', color: 'rgba(34, 197, 94, 0.3)', label: 'Lunch' },
        { from: '14:00', to: '16:00', color: 'rgba(249, 115, 22, 0.3)', label: 'Focus Time' },
      ]}
    />
  );
}

export const sectorsDemo: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  defaultExpanded: false,
};
