import { useAtom, useSetAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { MarketDataFeedSocket } from '../../socket/market';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
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
  Switch,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  styled,
} from '@mui/material';
import Positions from '../positions/Positions';
import { ORDER, instrumentKeys } from '../../config';
import { IndexList } from '../home/Home';
import { stores } from '../../store';
import { StyledTable } from '../../components/PostionsBar';
import QuantityInput from '../../components/QuantityInput';
import SocketTypo from '../../components/SocketTypo';
import { Cancel } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { upstoxClient } from '../../config/upstox';
import Tabs from '../../components/Tabs';
import ManageBasket from './ManageBasket';

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&::before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&::after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

const StyledPaper = styled(Paper)(() => ({
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
  refresh,
  setOrderTypeBuy,
  orderTypeBuy,
  manageBasket,
  selectedBasket,
  setSelectedBasket,
}) => {
  const [basketTabs] = useAtom(stores.basketLists);
  return (
    <StyledPaper variant="outlined">
      <Stack p={1} direction={'row'} alignItems={'center'}>
        <Box flexGrow={1}>
          <Tabs
            items={basketTabs}
            value={selectedBasket}
            onChange={(e, v) => setSelectedBasket(v)}
          />
        </Box>

        <Button size="small" onClick={manageBasket}>
          Manage
        </Button>
      </Stack>

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
            pb={0}
            direction={'row'}
            spacing={4}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption">Sell</Typography>
              <Android12Switch
                value={orderTypeBuy}
                defaultChecked
                onChange={e => setOrderTypeBuy(e.target.checked)}
              />
              <Typography variant="caption">Buy</Typography>
            </Stack>
            <Stack
              direction={'row'}
              spacing={1}
              display={'inline-flex'}
              alignItems={'center'}
            >
              <Typography variant="caption" color={'GrayText'}>
                Margin:
              </Typography>
              <Stack direction={'row'} alignItems={'center'}>
                {calcBrokerage && (
                  <IconButton size="small" onClick={refresh}>
                    <RefreshRoundedIcon
                      sx={{
                        fontSize: 16,
                        color: theme => theme.palette.primary.main,
                      }}
                    />
                  </IconButton>
                )}
                <Typography variant="caption" sx={{ minWidth: '80px' }}>
                  {formaToINR(calcBrokerage, true)}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <Stack
            p={2}
            direction={'row'}
            spacing={2}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Button
              variant="contained"
              size="large"
              onClick={placeBasket}
              color={orderTypeBuy ? 'primary' : 'error'}
            >
              Execute
            </Button>
            <Button size="large" color="inherit" onClick={resetBasket}>
              Reset
            </Button>
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

let storedFeeds = {};

const Basket = () => {
  const [updateState, forceUpdate] = useState();
  const [basketTabs] = useAtom(stores.basketLists);
  const [selectedBasket, setSelectedBasket] = useState(0);
  const [basketManageOpen, setBasketManageOpen] = useState(false);
  const [orderTypeBuy, setOrderTypeBuy] = useState(true);
  const [basketsData, setBaskets] = useAtom(stores.baskets);
  const { enqueueSnackbar } = useSnackbar();
  const [symbols] = useAtom(stores.symbolsObjects);
  const [feeds] = useAtom(stores.marketFeed);
  const [filteredSymbols] = useAtom(stores.filteredSymbols);
  const [quantitySizeInit] = useAtom(stores.quantitySizeInit);
  const setQuantitySize = useSetAtom(stores.quantitySize);
  const selectedBasketId = useMemo(() => {
    return basketTabs && basketTabs.length > 0
      ? basketTabs[selectedBasket].id
      : -1;
  }, [basketTabs, selectedBasket]);
  const baskets = useMemo(() => {
    return basketsData?.filter(basket => basket.basketId === selectedBasketId);
  }, [basketsData, selectedBasketId]);

  const [ltpStrikePrices, setLtpStrikePrices] = useState({
    [instrumentKeys.BANKNIFTY]: 0,
    [instrumentKeys.NIFTY]: 0,
    [instrumentKeys.FINNIFTY]: 0,
    [instrumentKeys.SENSEX]: 0,
  });
  useEffect(() => {
    Object.keys(feeds || {})?.forEach(feed => {
      storedFeeds[feed] = feeds[feed];
    });
  }, [feeds]);
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
    if (idx === -1)
      setBaskets([
        ...basketsData,
        { ...d, value: d.lot_size, basketId: selectedBasketId },
      ]);
  };
  const onQuantityChnage = (idx, v) => {
    const realIdx = basketsData.findIndex(
      basket =>
        basket.instrument_key === baskets[idx].instrument_key &&
        basket.basketId === selectedBasketId,
    );
    const _b = [...basketsData];
    _b[realIdx]['value'] = v;
    setBaskets(_b);
  };
  const deleteBasket = instrument_key => {
    const final = basketsData.filter(
      itm =>
        !(
          itm.instrument_key === instrument_key &&
          itm.basketId === selectedBasketId
        ),
    );
    setBaskets(final);
  };

  const placeBasket = () => {
    const orderType = orderTypeBuy ? ORDER.BUY : ORDER.SELL;
    placeBasketOrder(baskets, symbols, enqueueSnackbar, feeds, orderType);
  };
  const resetBasket = () => {
    const data = basketsData?.filter(itm => itm.basketId !== selectedBasketId);
    setBaskets(data);
  };

  const refresh = () => {
    forceUpdate({});
  };

  const manageBasket = () => {
    setBasketManageOpen(true);
  };

  const calcBrokerage = useMemo(() => {
    let charges = 0;
    if (baskets && baskets.length > 0) {
      baskets.forEach(itm => {
        const feedLtpc = storedFeeds[itm.instrument_key]?.ltpc?.ltp;
        charges += itm.value * (feedLtpc || 0);
      });
    }
    return charges;
  }, [baskets, updateState]);

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
          refresh={refresh}
          orderTypeBuy={orderTypeBuy}
          setOrderTypeBuy={setOrderTypeBuy}
          selectedBasket={selectedBasket}
          setSelectedBasket={setSelectedBasket}
          manageBasket={manageBasket}
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
          indexTitle={'FIN NIFTY'}
          ltpStrikePrices={ltpStrikePrices?.[instrumentKeys.FINNIFTY]}
          instrumentKey={instrumentKeys.FINNIFTY}
          data={filteredSymbols?.finNifty}
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
      </Stack>
      <ManageBasket
        open={basketManageOpen}
        onClose={() => setBasketManageOpen(false)}
      />
    </>
  );
};
export default Basket;
