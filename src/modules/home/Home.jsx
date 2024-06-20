import {
  Box,
  Button,
  Card,
  Divider,
  Grow,
  IconButton,
  Paper,
  Stack,
  Typography,
  alpha,
  darken,
  lighten,
  styled,
} from '@mui/material';
import {
  getColorWithThemeMode,
  getStrikePriceForOptionChain,
  getSymbolsWithClosedStrikePrices,
  placeUpstoxOrder,
} from '../../common/utils';
import { chain } from './chain';
import { useAtom, useSetAtom } from 'jotai';
import { stores } from '../../store';
import { useEffect, useRef, useState } from 'react';
import { upstoxClient } from '../../config/upstox';
import SocketTypo from '../../components/SocketTypo';
import { ORDER, instrumentKeys } from '../../config';
import { MarketDataFeedSocket } from '../../socket/market';
import CandlestickChartRoundedIcon from '@mui/icons-material/CandlestickChartRounded';
import { useSnackbar } from 'notistack';
import PostionsBar from '../../components/PostionsBar';
import QuantityInput from '../../components/QuantityInput';

const TableItemRoot = styled(Stack)(({ theme, active, selected }) => ({
  // borderTop: `1px solid ${theme.palette.divider}`,
  margin: '6px',
  minHeight: '37px',
  position: 'relative',
  alignItems: 'center',
  boxShadow: active
    ? `0px 0px 0px 1px ${darken(theme.palette.divider, 0.4)}`
    : 'none',
  justifyContent: 'center',

  borderRadius: '3px',
  padding: '2px 0px',
  ['& .chart-icon']: {
    position: 'absolute',
    display: 'none',
  },
  ['&.active']: {
    backgroundColor: lighten(theme.palette.divider, 0.5),
  },
  [`&.selected`]: {
    backgroundColor: getColorWithThemeMode(
      theme,
      lighten(theme.palette.info.main, 0.9),
      alpha(theme.palette.info.dark, 0.2),
    ),
    border: `1px solid ${getColorWithThemeMode(theme, lighten(theme.palette.info.dark, 0.85), alpha(theme.palette.info.dark, 0.2))}`,
    [`& .strick-price`]: {
      backgroundColor: getColorWithThemeMode(
        theme,
        theme.palette.info.main,
        alpha(theme.palette.info.main, 0.5),
      ),
      color: theme.palette.common.white,
    },
  },
  ['&:hover:not(.selected)']: {
    backgroundColor: lighten(theme.palette.divider, 0.6),
    cursor: 'pointer',
  },
  ['&:hover']: {
    ['& .actions']: {
      display: 'flex',
    },
    ['& .chart-icon']: {
      display: 'block',
      zIndex: 3,
    },
  },
  ['& .actions']: {
    display: 'none',
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    ['& button']: {
      // width: '30px',
      minWidth: '30px',
      minHeight: '30px',
      height: '30px',
      padding: '0px 8px',
      borderRadius: '7px',
      display: 'flex',
      alignItems: 'center',
      fontSize: '11px',
    },
  },
  ['&>div']: {
    flexGrow: 1,
    minWidth: '33%',
    display: 'flex',
    justifyContent: 'center',
    padding: '7px 9px',
  },
}));

const TableItemRootPrice = styled(props => (
  <SocketTypo variant="body2" {...props} />
))(({ theme }) => ({
  fontWeight: 400,
  color: 'text.primary',
  fontSize: '13px',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '5px',
  flexGrow: 1,
  width: `${100 / 3}%`,
}));

const TableItem = ({
  data,
  active,
  isLast,
  ltpStrikePrices,
  quantity,
  optionAdd,
  onOptionAdd,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [feeds] = useAtom(stores.marketFeed);
  let classes = [];
  const { strike, options } = data || {};
  const { CE, PE } = options || {};
  if (ltpStrikePrices === strike) classes.push('active');
  // if (isLast) classes.push('selected');

  const openChart = type => {
    const d = options[type];
    window.open(
      `https://tv.upstox.com/charts/${d.instrument_key}?isFromPW3=true`,
      '_blank',
    );
  };

  const placeOrder = type => {
    if (optionAdd) {
      onOptionAdd(options[type]);
      return;
    }
    const d = options[type];
    placeUpstoxOrder(
      d,
      quantity || d.lot_size,
      ORDER.BUY,
      enqueueSnackbar,
      feeds,
    );
  };

  return (
    <>
      <TableItemRoot
        direction={'row'}
        className={classes.join(' ')}
        key={strike}
      >
        <Box
        // sx={{
        //   backgroundColor: theme => alpha(theme.palette.success.light, 0.1),
        //   color: 'text.primary',
        // }}
        >
          <TableItemRootPrice instrumentKey={CE.instrument_key} />
        </Box>
        <Card
          className="strick-price"
          elevation={0}
          sx={{
            // backgroundColor: theme =>
            //   getColorWithThemeMode(
            //     theme,
            //     lighten(theme.palette.info.light, 0.9),
            //     theme.palette.divider,
            //   ),
            color: theme =>
              getColorWithThemeMode(
                theme,
                darken(theme.palette.info.main, 0.4),
                'text.primary',
              ),
            // border: theme => `1px solid ${theme.palette.info.dark}`,
            paddingY: '3px',
            paddingX: '7px',
            borderRadius: 2,
            height: '31px',
            display: 'flex',
            alignItems: 'center',
            position: 'absolute',
            minWidth: 'initial !important',
            overflow: 'initial',
          }}
        >
          <IconButton
            size="small"
            onClick={() => openChart('CE')}
            className="chart-icon"
            sx={{ right: `calc(100% - 1px)` }}
          >
            <CandlestickChartRoundedIcon
              sx={{ color: 'text.primary' }}
              fontSize="small"
            />
          </IconButton>
          <Typography variant="subtitle2">{strike}</Typography>
          <IconButton
            size="small"
            onClick={() => openChart('PE')}
            className="chart-icon"
            sx={{ left: `calc(100% - 1px)` }}
          >
            <CandlestickChartRoundedIcon
              sx={{ color: 'text.primary' }}
              fontSize="small"
            />
          </IconButton>
        </Card>
        <Box
        // sx={{
        //   backgroundColor: theme => alpha(theme.palette.error.light, 0.1),
        //   color: 'text.primary',
        // }}
        >
          <TableItemRootPrice instrumentKey={PE.instrument_key} />
        </Box>
        <Box className="actions">
          <Button
            disableElevation
            variant="contained"
            color="primary"
            onClick={() => placeOrder('CE')}
          >
            {optionAdd ? 'Add CE' : 'Buy CE'}
          </Button>
          <Button
            disableElevation
            variant="contained"
            color="primary"
            onClick={() => placeOrder('PE')}
          >
            {optionAdd ? 'Add PE' : 'Buy PE'}
          </Button>
        </Box>
      </TableItemRoot>
      {!isLast && (
        <Divider
          sx={{
            opacity: 0.4,
          }}
        />
      )}
    </>
  );
};
export const IndexList = ({
  indexTitle,
  data,
  instrumentKey,
  ltpStrikePrices,
  closeDiff,
  optionAdd,
  onOptionAdd,
  hideQtyInput,
}) => {
  // console.log('IndexList', indexTitle, data, ltpStrikePrices, instrumentKey);
  const [symbolQuantityInfo] = useAtom(stores.symbolQuantityInfo);
  const quantityInfo = symbolQuantityInfo?.[instrumentKey];
  const [optionChains, setOptionChain] = useState([]);
  const [quantitySize, setQuantitySize] = useAtom(stores.quantitySize);
  const [strikePrice, setStrikePrice] = useState(ltpStrikePrices);
  useEffect(() => {
    if (ltpStrikePrices !== 0) {
      setStrikePrice(ltpStrikePrices);
      const d = getSymbolsWithClosedStrikePrices(
        data,
        ltpStrikePrices,
        instrumentKey,
        closeDiff,
      );
      setOptionChain(d);
    }
  }, [ltpStrikePrices]);
  useEffect(() => {
    console.log('useEffect', strikePrice);
  }, [strikePrice]);

  const openChart = () => {
    window.open(
      `https://tv.upstox.com/charts/${instrumentKey}?isFromPW3=true`,
      '_blank',
    );
  };

  const onChangeQuantitySize = v => {
    setQuantitySize({ ...quantitySize, [instrumentKey]: v });
  };
  return (
    <StyledPaper variant="outlined">
      <Box p={1} px={2}>
        <Stack direction={'row'} spacing={1} alignItems={'center'}>
          <Typography variant="subtitle2">{indexTitle}</Typography>{' '}
          <SocketTypo
            variant={'subtitle2'}
            isBoldForPositive
            fontSize={12}
            showWithPerc
            instrumentKey={instrumentKey}
          />
          <IconButton
            size="small"
            onClick={() => openChart('PE')}
            className="chart-icon"
          >
            <CandlestickChartRoundedIcon
              sx={{ color: 'text.primary' }}
              fontSize="small"
            />
          </IconButton>
          {!hideQtyInput && (
            <QuantityInput
              quantityInfo={quantityInfo}
              value={quantitySize?.[instrumentKey]}
              onChange={onChangeQuantitySize}
            />
          )}
        </Stack>
      </Box>
      <Divider />
      {Array.isArray(optionChains) &&
        optionChains.map((option, idx) => (
          <TableItem
            data={option}
            quantity={quantitySize?.[instrumentKey]}
            key={option.strike}
            active={idx === 2}
            ltpStrikePrices={strikePrice}
            isLast={chain.length === idx + 1}
            optionAdd={optionAdd}
            onOptionAdd={onOptionAdd}
          />
        ))}
    </StyledPaper>
  );
};

const Home = () => {
  const [filteredSymbols] = useAtom(stores.filteredSymbols);
  const [quantitySizeInit] = useAtom(stores.quantitySizeInit);
  const setQuantitySize = useSetAtom(stores.quantitySize);
  const [ltpStrikePrices, setLtpStrikePrices] = useState({
    [instrumentKeys.BANKNIFTY]: 0,
    [instrumentKeys.NIFTY]: 0,
    [instrumentKeys.FINNIFTY]: 0,
    [instrumentKeys.SENSEX]: 0,
  });
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
  return (
    <>
      <Stack direction={'row'} spacing={4}>
        <IndexList
          indexTitle={'NIFTY 50'}
          ltpStrikePrices={ltpStrikePrices?.[instrumentKeys.NIFTY]}
          instrumentKey={instrumentKeys.NIFTY}
          data={filteredSymbols?.nifty}
          closeDiff={3}
        />
        <Box sx={{ width: `69.666667%` }}>
          <PostionsBar />
        </Box>
      </Stack>

      <Stack direction={'row'} spacing={4} mt={3}>
        <IndexList
          indexTitle={'BANK NIFTY'}
          ltpStrikePrices={ltpStrikePrices?.[instrumentKeys.BANKNIFTY]}
          instrumentKey={instrumentKeys.BANKNIFTY}
          data={filteredSymbols?.bankNifty}
        />
        <IndexList
          indexTitle={'FIN NIFTY'}
          ltpStrikePrices={ltpStrikePrices?.[instrumentKeys.FINNIFTY]}
          instrumentKey={instrumentKeys.FINNIFTY}
          data={filteredSymbols?.finNifty}
        />
        <IndexList
          indexTitle={'SENSEX'}
          ltpStrikePrices={ltpStrikePrices?.[instrumentKeys.SENSEX]}
          instrumentKey={instrumentKeys.SENSEX}
          data={filteredSymbols?.sensex}
        />
      </Stack>
    </>
  );
};

export default Home;
