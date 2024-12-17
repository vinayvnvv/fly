import PropTypes from 'prop-types';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { quanitiesArray } from '../modules/settings/Settings';
import { useCallback, useEffect } from 'react';
import { useAtom } from 'jotai';
import { stores } from '../store';
import { instrumentKeys, ORDER } from '../config';
import { placeUpstoxOrder } from '../common/utils';
import { useSnackbar } from 'notistack';

export default function BuyAtStrike({ ltpStrikePrices }) {
  const [symbols] = useAtom(stores.filteredSymbols);
  const { enqueueSnackbar } = useSnackbar();
  const [feeds] = useAtom(stores.marketFeed);
  const [quantitySizeInit] = useAtom(stores.quantitySizeInit);
  const [selectedIndex, setSelectedIndex] = useAtom(stores.selectedBuyAtStrike);
  useEffect(() => {
    if (!selectedIndex) {
      setSelectedIndex({
        [instrumentKeys.NIFTY]: true,
        [instrumentKeys.BANKNIFTY]: true,
        [instrumentKeys.FINNIFTY]: true,
        [instrumentKeys.SENSEX]: true,
      });
    }
  }, []);
  const buy = useCallback(
    instrument_type => {
      if (!quantitySizeInit) {
        enqueueSnackbar({
          message: 'Quantity Size is not set',
          variant: 'error',
        });
        return;
      }
      console.log('buy', ltpStrikePrices, symbols);
      const niftyOption = symbols?.nifty?.filter(
        symb =>
          symb.strike_price === ltpStrikePrices[instrumentKeys.NIFTY] &&
          instrument_type === symb.instrument_type,
      ); // Example expression to complete the function
      const bankNiftyOption = symbols?.bankNifty?.filter(
        symb =>
          symb.strike_price === ltpStrikePrices[instrumentKeys.BANKNIFTY] &&
          instrument_type === symb.instrument_type,
      ); // Example expression to complete the function
      const finNiftyOption = symbols?.finNifty?.filter(
        symb =>
          symb.strike_price === ltpStrikePrices[instrumentKeys.FINNIFTY] &&
          instrument_type === symb.instrument_type,
      ); // Example expression to complete the function
      const sensexOption = symbols?.sensex?.filter(
        symb =>
          symb.strike_price === ltpStrikePrices[instrumentKeys.SENSEX] &&
          instrument_type === symb.instrument_type,
      ); // Example expression to complete the function
      if (niftyOption?.[0] && selectedIndex[instrumentKeys.NIFTY]) {
        placeUpstoxOrder(
          niftyOption[0],
          quantitySizeInit[instrumentKeys.NIFTY],
          instrument_type === 'CE' ? ORDER.BUY : ORDER.SELL,
          enqueueSnackbar,
          feeds,
        );
      }
      if (bankNiftyOption?.[0] && selectedIndex[instrumentKeys.BANKNIFTY]) {
        placeUpstoxOrder(
          bankNiftyOption[0],
          quantitySizeInit[instrumentKeys.BANKNIFTY],
          instrument_type === 'CE' ? ORDER.BUY : ORDER.SELL,
          enqueueSnackbar,
          feeds,
        );
      }
      if (finNiftyOption?.[0] && selectedIndex[instrumentKeys.FINNIFTY]) {
        placeUpstoxOrder(
          finNiftyOption[0],
          quantitySizeInit[instrumentKeys.FINNIFTY],
          instrument_type === 'CE' ? ORDER.BUY : ORDER.SELL,
          enqueueSnackbar,
          feeds,
        );
      }
      if (sensexOption?.[0] && selectedIndex[instrumentKeys.SENSEX]) {
        placeUpstoxOrder(
          sensexOption[0],
          quantitySizeInit[instrumentKeys.SENSEX],
          instrument_type === 'CE' ? ORDER.BUY : ORDER.SELL,
          enqueueSnackbar,
          feeds,
        );
      }
    },
    [ltpStrikePrices, symbols, selectedIndex, quantitySizeInit],
  );
  const onSelectedIndexChange = (e, instrumentKey) => {
    setSelectedIndex({
      ...selectedIndex,
      [instrumentKey]: e.target.checked,
    });
  };
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack
        spacing={3}
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Stack>
          <Typography variant="subtitle2" fontWeight={600}>
            Quick Buy
          </Typography>
          <Typography variant="caption" color={'GrayText'}>
            Buy At Strike Price
          </Typography>
        </Stack>
        <Stack direction={'row'} alignItems={'center'}>
          {quanitiesArray.map(q => (
            <FormControlLabel
              key={q.instrumentKey}
              control={
                <Checkbox
                  onChange={e => onSelectedIndexChange(e, q.instrumentKey)}
                  checked={selectedIndex?.[q.instrumentKey]}
                />
              }
              label={q.name}
            />
          ))}
        </Stack>
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
          <Button color="success" onClick={() => buy('CE')} variant="contained">
            Buy CE
          </Button>
          <Button color="error" onClick={() => buy('PE')} variant="contained">
            Buy PE
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

BuyAtStrike.propTypes = {
  ltpStrikePrices: PropTypes.object.isRequired,
};
