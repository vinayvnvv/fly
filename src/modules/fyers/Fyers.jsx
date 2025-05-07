import { useEffect, useState } from 'react';
import { FyersOrders } from './Orders';
import Tabs from '../../components/Tabs';
import { FyersPositions } from './Positions';
import { fyers } from '../../main';
import { Stack, Typography } from '@mui/material';
import { formaToINR } from '../../common/utils';

const tabs = [
  { id: 0, name: 'Positions' },
  { id: 1, name: 'Orders' },
];

export const Fyers = () => {
  const [tab, setTab] = useState(0);
  const [funds, setFunds] = useState([]);
  useEffect(() => {
    fyers.get_funds().then(res => {
      let _funds = {};
      const { fund_limit } = res || {};
      if (fund_limit) {
        _funds = fund_limit.filter(itm => itm.title === 'Available Balance');
        if (_funds.length > 0) {
          _funds = _funds[0];
          setFunds(_funds);
        }
      }
    });
  }, []);
  return (
    <div>
      <Stack
        direction={'row'}
        alignItems={'center'}
        spacing={2}
        justifyContent={'space-between'}
      >
        <Tabs items={tabs} value={tab} onChange={(e, v) => setTab(v)} />
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
          <Typography variant="subtitle2" color={'GrayText'}>
            Margin Avail:
          </Typography>
          <Typography variant="subtitle2" fontWeight={600}>
            {typeof funds?.equityAmount === 'number'
              ? formaToINR(funds.equityAmount.toFixed(2))
              : formaToINR(funds?.equityAmount)}
          </Typography>
        </Stack>
      </Stack>

      <br />
      <br />
      {tab === 0 && <FyersPositions />}
      {tab === 1 && <FyersOrders />}
    </div>
  );
};
