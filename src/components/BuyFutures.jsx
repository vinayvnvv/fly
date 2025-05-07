import {
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { instrumentKeys, ORDER } from '../config';
import QuantityInput from './QuantityInput';
import { useAtom } from 'jotai';
import { stores } from '../store';
import { useCallback, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { placeUpstoxOrder } from '../common/utils';
import { fyers } from '../main';

const futuresArray = [
  { name: 'Nifty', instrumentKey: instrumentKeys.NIFTY },
  { name: 'Bank Nifty', instrumentKey: instrumentKeys.BANKNIFTY },
];

const BuyFutures = ({ isMobile, onTransaction }) => {
  const [symbolQuantityInfo] = useAtom(stores.symbolQuantityInfo);
  const { enqueueSnackbar } = useSnackbar();
  const [futuresQuantitySize, setFuturesQuantitySize] = useAtom(
    stores.futuresQuantitySize,
  );
  const [futures] = useAtom(stores.futures);
  const [selectedIndex, setSelectedIndex] = useAtom(
    stores.selectedFuturesBuyAtStrike,
  );
  const onChangeQuantitySize = (instrument_key, value) => {
    setFuturesQuantitySize({ ...futuresQuantitySize, [instrument_key]: value });
  };
  const order = type => {
    const orders = [];
    if (!futuresQuantitySize) {
      enqueueSnackbar({
        message: 'Quantity Size is not set',
        variant: 'error',
      });
      return;
    }
    if (futures?.[instrumentKeys.BANKNIFTY]) {
      if (selectedIndex?.[instrumentKeys.BANKNIFTY]) {
        const symbol = futures?.[instrumentKeys.BANKNIFTY];
        orders.push({
          symbol: symbol.fyers_symbol,
          qty: futuresQuantitySize?.[instrumentKeys.BANKNIFTY],
          type: 2,
          side: type === ORDER.BUY ? 1 : -1,
          productType: 'INTRADAY',
          limitPrice: 0,
          stopPrice: 0,
          validity: 'DAY',
          disclosedQty: 0,
          offlineOrder: false,
          stopLoss: 0,
          takeProfit: 0,
        });
      }
    }
    if (futures?.[instrumentKeys.NIFTY]) {
      if (selectedIndex?.[instrumentKeys.NIFTY]) {
        const symbol = futures?.[instrumentKeys.NIFTY];
        orders.push({
          symbol: symbol.fyers_symbol,
          qty: futuresQuantitySize?.[instrumentKeys.NIFTY],
          type: 2,
          side: ORDER.BUY ? 1 : -1,
          productType: 'INTRADAY',
          limitPrice: 0,
          stopPrice: 0,
          validity: 'DAY',
          disclosedQty: 0,
          offlineOrder: false,
          stopLoss: 0,
          takeProfit: 0,
          orderTag: 'fut',
        });
      }
    }
    console.log('orders', orders);
    fyers
      .place_multi_order(orders)
      .then(res => {
        console.log(res);
        enqueueSnackbar({
          message: 'Order Sent.',
          variant: 'success',
        });
        onTransaction();
      })
      .catch(err => {
        console.log('orders', err);
        enqueueSnackbar({
          message: err?.message || 'Error in order sent.',
          variant: 'error',
        });
      });
  };

  const onSelectedIndexChange = (e, instrumentKey) => {
    setSelectedIndex({
      ...selectedIndex,
      [instrumentKey]: e.target.checked,
    });
  };

  useEffect(() => {
    if (!selectedIndex) {
      setSelectedIndex({
        [instrumentKeys.NIFTY]: true,
        [instrumentKeys.BANKNIFTY]: true,
        [instrumentKeys.FINNIFTY]: true,
        [instrumentKeys.SENSEX]: true,
      });
    }
    if (!futuresQuantitySize) {
      setFuturesQuantitySize({
        [instrumentKeys.NIFTY]:
          symbolQuantityInfo?.[instrumentKeys.NIFTY]?.minimum_lot,
        [instrumentKeys.BANKNIFTY]:
          symbolQuantityInfo?.[instrumentKeys.BANKNIFTY]?.minimum_lot,
      });
    }
  }, []);
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack
        spacing={isMobile ? 1 : 3}
        direction={isMobile ? 'column' : 'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        {!isMobile && (
          <Stack>
            <Typography variant="subtitle2" fontWeight={600}>
              Buy Futures
            </Typography>
            <Typography variant="caption" color={'GrayText'}>
              Buy At Strike Price
            </Typography>
          </Stack>
        )}
        <Stack direction={'row'} alignItems={'center'} spacing={3}>
          {futuresArray.map(q => {
            const quantityInfo = symbolQuantityInfo?.[q.instrumentKey];
            return (
              <Stack
                key={q.instrumentKey}
                direction={'row'}
                alignItems={'center'}
                spacing={1}
              >
                <FormControlLabel
                  key={q.instrumentKey}
                  control={
                    <Checkbox
                      onChange={e => onSelectedIndexChange(e, q.instrumentKey)}
                      checked={selectedIndex?.[q.instrumentKey]}
                    />
                  }
                  label={
                    <Typography
                      variant={isMobile ? 'caption' : 'body1'}
                      sx={{
                        maxWidth: isMobile ? 70 : 'auto',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {q.name}
                    </Typography>
                  }
                />
                <QuantityInput
                  quantityInfo={quantityInfo}
                  value={futuresQuantitySize?.[q.instrumentKey]}
                  onChange={v => onChangeQuantitySize(q.instrumentKey, v)}
                />
              </Stack>
            );
          })}
        </Stack>
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
          <Button
            color="success"
            onClick={() => order(ORDER.BUY)}
            variant="contained"
          >
            Buy
          </Button>
          <Button
            color="error"
            onClick={() => order(ORDER.SELL)}
            variant="contained"
          >
            Sell
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default BuyFutures;
