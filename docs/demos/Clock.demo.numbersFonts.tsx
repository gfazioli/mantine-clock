import { Clock } from '@gfazioli/mantine-clock';
import { MantineDemo } from '@mantinex/demo';

function Demo() {
  return (
    <Clock
      primaryNumbersColor="blue"
      primaryNumbersProps={{
        ff: 'monospace',
        fw: 900,
        fz: 32,
      }}
      secondaryNumbersColor="gray"
      secondaryNumbersProps={{
        ff: 'monospace',
        fw: 500,
        fz: 16,
      }}
      styles={{
        primaryNumber: {
          textShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        },
      }}
    />
  );
}

const code = `
import { Clock } from '@gfazioli/mantine-clock';

function Demo() {
  return (
    <Clock
      primaryNumbersColor="blue"
      primaryNumbersProps={{
        ff: 'monospace',
        fw: 900,
        fz: 32,
      }}
      secondaryNumbersColor="gray"
      secondaryNumbersProps={{
        ff: 'monospace',
        fw: 500,
        fz: 16,
      }}
      styles={{
        primaryNumber: {
          textShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        },
      }}
    />
  );
}
`;

export const numberFonts: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  defaultExpanded: false,
};
