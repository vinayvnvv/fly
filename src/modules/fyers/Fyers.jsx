import { useEffect, useState } from 'react';
import { FyersOrders } from './Orders';
import Tabs from '../../components/Tabs';
import { convertToUpstoxPositions, FyersPositions } from './Positions';
import { fyers } from '../../main';
import { Stack, Typography } from '@mui/material';
import { formaToINR } from '../../common/utils';
import BuyFutures from '../../components/BuyFutures';
import PostionsBar from '../../components/PostionsBar';
import { useAtom } from 'jotai';
import { stores } from '../../store';

const tabs = [
  { id: 0, name: 'Positions' },
  { id: 1, name: 'Orders' },
];

export const Fyers = () => {
  const [tab, setTab] = useState(0);
  const [funds, setFunds] = useState([]);
  const [positions, setPositions] = useState();
  const [symbols] = useAtom(stores.symbols);
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

  const getPositions = () => {
    fyers.get_positions().then(res => {
      if (res.code === 200) {
        setPositions(convertToUpstoxPositions(res.netPositions, symbols));
      }
    });
  };
  useEffect(() => {
    getPositions();
  }, []);
  console.log(positions);
  const onTransaction = () => {
    getPositions();
  };
  return (
    <div>
      <Stack
        direction={'row'}
        alignItems={'center'}
        spacing={2}
        justifyContent={'space-between'}
      >
        <Tabs items={tabs} value={tab} onChange={(e, v) => setTab(v)} />
        <Stack direction={'row'} alignItems={'center'} spacing={2}>
          <Stack direction={'row'} alignItems={'center'}>
            <Typography variant="subtitle2" color={'GrayText'}>
              PL:
            </Typography>
            <PostionsBar
              showOnlyProfit
              showPercAtInit
              positionsData={{ data: positions }}
              isFyers
              fyers={{
                margin: funds?.equityAmount,
              }}
              onFyerTransaction={onTransaction}
            />
          </Stack>
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
      </Stack>

      <br />
      <BuyFutures onTransaction={onTransaction} />
      <br />

      {tab === 0 && (
        <FyersPositions
          funds={funds}
          positions={positions}
          setPositions={setPositions}
          onTransaction={onTransaction}
        />
      )}
      {tab === 1 && <FyersOrders />}
    </div>
  );
};
