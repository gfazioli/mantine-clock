import { Clock } from '@gfazioli/mantine-clock';
import { MantineDemo } from '@mantinex/demo';
import { ClockStylesApi } from '../styles-api/Clock.styles-api';

const code = `
import { Clock } from '@gfazioli/mantine-clock';

function Demo() {
  return (
    <Clock{{props}} />
  );
}
`;

function Demo(props: any) {
  return <Clock {...props} />;
}

export const stylesApi: MantineDemo = {
  type: 'styles-api',
  data: ClockStylesApi,
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
};
