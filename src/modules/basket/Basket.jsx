import { useAtom, useSetAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { MarketDataFeedSocket } from '../../socket/market';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import {
  formaToINR,
  getFormattedSymbolName,
  getStrikePriceForOptionChain,
  placeBasketOrder,
} from '../../common/utils';
import {
  Alert,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  styled,
} from '@mui/material';
import Positions from '../positions/Positions';
import { instrumentKeys } from '../../config';
import { IndexList } from '../home/Home';
import { stores } from '../../store';
import { StyledTable } from '../../components/PostionsBar';
import QuantityInput from '../../components/QuantityInput';
import SocketTypo from '../../components/SocketTypo';
import { Cancel } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { upstoxClient } from '../../config/upstox';

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '5px',
  flexDirection: 'column',
  justifyContent: 'space-between',
  display: 'flex',
  flexGrow: 1,
  width: `${100 / 3}%`,
}));

const BasketBox = ({
  data,
  onChangeQuantitySize,
  deleteBasket,
  placeBasket,
  resetBasket,
  calcBrokerage,
}) => {
  return (
    <StyledPaper variant="outlined">
      {Array.isArray(data) && data.length > 0 ? (
        <>
          <Box>
            <StyledTable
              size="small"
              sx={{ width: '100%' }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textAlign: 'left' }}>Instrument</TableCell>
                  <TableCell align="center">Qty</TableCell>
                  <TableCell align="right">LTP</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(data) &&
                  data.map((basket, idx) => {
                    return (
                      <TableRow key={basket.instrument_key}>
                        <TableCell>
                          <Typography
                            variant="body2"
                            fontSize={10}
                            fontWeight={500}
                            textTransform={'uppercase'}
                          >
                            {getFormattedSymbolName(basket) ||
                              basket.trading_symbol}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <QuantityInput
                            quantityInfo={basket}
                            value={basket.value}
                            onChange={v => onChangeQuantitySize(idx, v)}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <SocketTypo
                            instrumentKey={basket?.instrument_key}
                            fontSize={'10px'}
                            forceColor={'text.primary'}
                            sx={{
                              color: theme =>
                                `${theme.palette.text.primary}!important`,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Remove">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                deleteBasket(basket?.instrument_key)
                              }
                            >
                              <Cancel fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </StyledTable>
          </Box>
          <Stack
            p={2}
            direction={'row'}
            spacing={2}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Button variant="contained" size="large" onClick={placeBasket}>
              Execute
            </Button>
            <Button size="large" color="inherit" onClick={resetBasket}>
              Reset
            </Button>
            <Stack direction={'row'} spacing={1}>
              <Typography variant="caption" color={'GrayText'}>
                Charges:
              </Typography>
              <Typography variant="caption">
                {formaToINR(calcBrokerage, true)}
              </Typography>
            </Stack>
          </Stack>
        </>
      ) : (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Alert icon={<HourglassEmptyIcon />} severity="info">
            Basket is Empty.
          </Alert>
        </Box>
      )}
    </StyledPaper>
  );
};

const Basket = () => {
  const [baskets, setBaskets] = useAtom(stores.baskets);
  const { enqueueSnackbar } = useSnackbar();
  const [symbols] = useAtom(stores.symbolsObjects);
  const [feeds] = useAtom(stores.marketFeed);
  const [filteredSymbols] = useAtom(stores.filteredSymbols);
  const [quantitySizeInit] = useAtom(stores.quantitySizeInit);
  const setQuantitySize = useSetAtom(stores.quantitySize);
  const [ltpStrikePrices, setLtpStrikePrices] = useState({
    [instrumentKeys.BANKNIFTY]: 0,
    [instrumentKeys.NIFTY]: 0,
    [instrumentKeys.FINNIFTY]: 0,
    [instrumentKeys.SENSEX]: 0,
  });
  // useEffect(() => {
  //   if (baskets && baskets.length > 0) {
  //     baskets.forEach(basket => {
  //       upstoxClient.brokerage(
  //         basket.instrument_key,
  //         basket.lot_size,
  //         'SELL',
  //         25,
  //       );
  //     });
  //   }
  // }, [baskets]);
  useEffect(() => {
    MarketDataFeedSocket.on(res => {
      const changedStrike = getStrikePriceForOptionChain(ltpStrikePrices, res);
      if (typeof changedStrike === 'object') {
        const keys = Object.keys(changedStrike);
        if (keys.length > 0) {
          const newVal = { ...ltpStrikePrices };
          Object.keys(changedStrike).forEach(k => {
            // console.log('changed', k);
            if (
              ltpStrikePrices[k] !== changedStrike[k] &&
              changedStrike[k] !== 0 &&
              changedStrike[k] !== null
            ) {
              newVal[k] = changedStrike[k];
            }
          });
          setLtpStrikePrices(newVal);
        }
      }
    });
    setQuantitySize(quantitySizeInit);
  }, []);
  const onOptionAdd = d => {
    const idx = baskets.findIndex(
      itm => itm.instrument_key === d.instrument_key,
    );
    if (idx === -1) setBaskets([...baskets, { ...d, value: d.lot_size }]);
  };
  const onQuantityChnage = (idx, v) => {
    const _b = [...baskets];
    _b[idx]['value'] = v;
    setBaskets(_b);
  };
  const deleteBasket = instrument_key => {
    const final = baskets.filter(itm => itm.instrument_key !== instrument_key);
    setBaskets(final);
  };

  const placeBasket = () => {
    placeBasketOrder(baskets, symbols, enqueueSnackbar, feeds);
  };
  const resetBasket = () => {
    setBaskets([]);
  };

  const calcBrokerage = useMemo(() => {
    let charges = 0;
    if (baskets && baskets.length > 0) {
      baskets.forEach(itm => {
        charges += itm.value * feeds[itm.instrument_key]?.ltpc?.ltp;
      });
    }
    return charges;
  }, [baskets]);

  return (
    <>
      <Stack direction={'row'} spacing={2}>
        <BasketBox
          data={baskets}
          onChangeQuantitySize={onQuantityChnage}
          deleteBasket={deleteBasket}
          placeBasket={placeBasket}
          calcBrokerage={calcBrokerage}
          resetBasket={resetBasket}
        />

        <Box sx={{ width: `62.666667%` }}>
          <Positions />
        </Box>
      </Stack>

      <Stack direction={'row'} spacing={2} mt={2}>
        <IndexList
          optionAdd
          onOptionAdd={onOptionAdd}
          indexTitle={'NIFTY 50'}
          ltpStrikePrices={ltpStrikePrices?.[instrumentKeys.NIFTY]}
          instrumentKey={instrumentKeys.NIFTY}
          data={filteredSymbols?.nifty}
          closeDiff={4}
        />
        <IndexList
          optionAdd
          onOptionAdd={onOptionAdd}
          indexTitle={'BANK NIFTY'}
          ltpStrikePrices={ltpStrikePrices?.[instrumentKeys.BANKNIFTY]}
          instrumentKey={instrumentKeys.BANKNIFTY}
          data={filteredSymbols?.bankNifty}
          closeDiff={4}
        />
        <IndexList
          optionAdd
          onOptionAdd={onOptionAdd}
          indexTitle={'SENSEX'}
          ltpStrikePrices={ltpStrikePrices?.[instrumentKeys.SENSEX]}
          instrumentKey={instrumentKeys.SENSEX}
          data={filteredSymbols?.sensex}
          closeDiff={4}
        />
        <IndexList
          optionAdd
          onOptionAdd={onOptionAdd}
          indexTitle={'FIN NIFTY'}
          ltpStrikePrices={ltpStrikePrices?.[instrumentKeys.FINNIFTY]}
          instrumentKey={instrumentKeys.FINNIFTY}
          data={filteredSymbols?.finNifty}
          closeDiff={4}
        />
      </Stack>
    </>
  );
};
export default Basket;
