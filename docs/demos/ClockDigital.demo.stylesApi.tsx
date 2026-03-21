import { Clock } from '@gfazioli/mantine-clock';
import { MantineDemo } from '@mantinex/demo';
import { ClockDigitalStylesApi } from '../styles-api/ClockDigital.styles-api';

const code = `
import { Clock } from '@gfazioli/mantine-clock';

function Demo() {
  return (
    <Clock.Digital{{props}} size="xl" showDate use24Hours={false} showAmPm />
  );
}
`;

function Demo(props: any) {
  return <Clock.Digital {...props} size="xl" showDate use24Hours={false} showAmPm />;
}

export const digitalStylesApi: MantineDemo = {
  type: 'styles-api',
  data: ClockDigitalStylesApi,
  component: Demo,
  code,
  centered: true,
};
