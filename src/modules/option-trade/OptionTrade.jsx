import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getFormattedSymbolName,
  placeUpstoxOrder,
  roundUpToNearestTenth,
  toggleAppBar,
} from '../../common/utils';
import {
  Alert,
  AlertTitle,
  alpha,
  AppBar,
  Box,
  Button,
  Card,
  IconButton,
  OutlinedInput,
  Stack,
  styled,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { ColorType, createChart } from 'lightweight-charts';
import dayjs from 'dayjs';
import { upstoxClient } from '../../config/upstox';
import moment from 'moment';
import { useAtom } from 'jotai';
import { stores } from '../../store';
import SocketTypo from '../../components/SocketTypo';
import PostionsBar from '../../components/PostionsBar';
import QuantityInput from '../../components/QuantityInput';
import { useSnackbar } from 'notistack';
import { ORDER } from '../../config';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import TimeClock from '../../components/Clock';
import BuySellSwitch from '../../components/BuySellSwitch';
import PendingOrders from './PendingOrders';
import { OrdersSocket } from '../../socket/portfolio';

const rightWindowWidth = 680;

const Container = styled(Box)(({ theme }) => ({
  width: '100vw',
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100vh',
  backgroundColor: theme.palette.background.paper,
  zIndex: 777,
}));
export const candleOptions = {
  upColor: '#45dc4c',
  downColor: '#ee524e',
  borderUpColor: '#1e7224',
  borderDownColor: '#8d302d',
  wickDownColor: '#000000',
  wickUpColor: '#000000',
};
export const candleDarkOptions = {
  upColor: '#45dc4c',
  downColor: '#ee524e',
  borderUpColor: '#1e7224',
  borderDownColor: '#8d302d',
  wickDownColor: '#777',
  wickUpColor: '#777',
};
const defaultCrossHairOptions = mode => {
  return {
    mode: 0,
    vertLine: {
      width: 1.2,
      visible: true,
      color: mode === 'light' ? 'grey' : '#777',
      style: 3,
    },
    horzLine: {
      width: 1.2,
      visible: true,
      color: mode === 'light' ? 'grey' : '#777',
      style: 3,
    },
  };
};
let Chart;
let Series;
let open, low, high, time;
let avgPriceLine;
let handleChartClickEvent;
let currentPrice;
const toDate = moment().format('YYYY-MM-DD');
const fromDate = moment().subtract(10, 'days').format('YYYY-MM-DD');
let min = -1;
function OptionTrade() {
  const chartContainerRef = useRef();
  const search = useSearchParams();
  const [data, setData] = useState([]);
  const [orders, setOrders] = useState();
  const [init, setInit] = useState(false);
  const [pointer, setPointer] = useState(false);
  const theme = useTheme();
  const [symbols] = useAtom(stores.symbolsObjects);
  const [symbolQuantityInfo] = useAtom(stores.symbolQuantityInfo);
  const [orderInput, setOrderInput] = useState({
    type: ORDER.BUY,
    SL: { price: '', trigger: '' },
    LIMIT: { price: '' },
  });
  const { enqueueSnackbar } = useSnackbar();

  const [feeds] = useAtom(stores.marketFeed);
  let [positions] = useAtom(stores.positions);
  const instrument = search?.[0]?.get('instrument');
  const positionsData = positions?.data;
  const instrumentPosition = positionsData?.filter(
    a => a.instrument_token === instrument,
  )?.[0];
  const symbol = symbols[instrument];
  const quantityInfo = symbolQuantityInfo?.[symbol?.underlying_key];

  const [quantitySize, onChangeQuantitySize] = useState(quantityInfo?.lot_size);

  const pendingOrders = orders?.filter(
    order => order.status === 'trigger pending',
  );

  useEffect(() => {
    const ltpc = feeds?.[instrument]?.ltpc;
    const _min = moment().format('mm');
    if (ltpc?.ltp && Series) {
      currentPrice = ltpc?.ltp;
      if (min !== _min) {
        time = moment().unix();
        min = _min;
        open = ltpc.ltp;
        low = ltpc.ltp;
        high = ltpc.ltp;
      }
      if (ltpc.ltp > high) {
        high = ltpc.ltp;
      }
      if (ltpc.ltp < low) {
        low = ltpc.ltp;
      }
      Series?.update({
        time: time,
        open: open,
        high: high,
        low: low,
        close: ltpc.ltp,
      });
    }
  }, [feeds[instrument]]);

  const getOrders = () => {
    upstoxClient.getOrderBook().then(response => {
      setOrders(response?.data?.reverse());
    });
  };

  const initChart = initialData => {
    Chart = createChart(chartContainerRef.current, {
      layout: {
        background: {
          type: ColorType.Solid,
          color: theme.palette.mode === 'light' ? 'white' : 'black',
        },
        textColor: theme.palette.mode === 'light' ? 'black' : 'white',
      },
      autoSize: false,
      width: window.innerWidth - rightWindowWidth,
      height: window.innerHeight,
      rightPriceScale: {
        autoScale: false,
      },
      grid: {
        vertLines: {
          color: theme.palette.mode === 'light' ? '#f0f0f0' : '#222',
        },
        horzLines: {
          color: theme.palette.mode === 'light' ? '#f0f0f0' : '#222',
        },
      },
      timeScale: {
        timeVisible: true,
        tickMarkFormatter: (time, tickMarkType) => {
          let str = '';
          if (tickMarkType === 2) {
            str = dayjs.unix(time).format('DD');
          } else if (tickMarkType === 0) {
            str = dayjs.unix(time).format('YYYY');
          } else if (tickMarkType === 1) {
            str = dayjs.unix(time).format('MMM');
          } else if (tickMarkType === 3) {
            str = dayjs.unix(time).format('hh:mm');
          } else if (tickMarkType === 4) {
            str = dayjs.unix(time).format('hh:mm:ss');
          }
          return str;
        },
      },
      crosshair: defaultCrossHairOptions(theme.palette.mode),
      localization: {
        locale: 'en-US',
        timeFormatter: v => {
          return dayjs.unix(v).format('ddd DD MMM  hh:mm:ss');
        },
      },
    });
    Chart.timeScale().fitContent();
    Series = Chart.addCandlestickSeries({
      ...(theme.palette.mode === 'light' ? candleOptions : candleDarkOptions),
    });
    setData(initialData);
    Series.setData(initialData);
    Chart?.timeScale().fitContent();
    setInit(true);
  };

  useEffect(() => {
    const handleResize = () => {
      Chart?.applyOptions({ width: window.innerWidth - rightWindowWidth });
    };
    toggleAppBar(false);
    upstoxClient
      .getHistoricalCandle(instrument, '1minute', toDate, fromDate)
      .then(res => {
        initChart(res);
      });
    getOrders();
    window.addEventListener('resize', handleResize);
    const onOrderUpdate = () => {
      getOrders();
    };
    OrdersSocket.on(onOrderUpdate);
    return () => {
      toggleAppBar(true);
      OrdersSocket.off(onOrderUpdate);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (instrumentPosition && init) {
      const avgPrice = Math.abs(
        (instrumentPosition.day_sell_value - instrumentPosition.day_buy_value) /
          instrumentPosition.quantity,
      );
      if (avgPrice) {
        if (!avgPriceLine) {
          avgPriceLine = Series?.createPriceLine({
            price: avgPrice,
            color: 'blue',
            lineWidth: 2,
            axisLabelVisible: true,
          });
        } else {
          avgPriceLine.applyOptions({
            price: avgPrice,
          });
        }
      }
    } else {
      if (avgPriceLine) {
        Series?.removePriceLine(avgPriceLine);
      }
    }
  }, [positions, init]);

  const handleSLOrders = (pointer, price) => {
    console.log('handleSLOrders', pointer);
    price = roundUpToNearestTenth(price);
    const d = {};
    if (pointer === 'SL') {
      if (currentPrice > price) {
        d['price'] = price - (price > 10 ? 10 : 1);
        d['trigger'] = price;
      } else {
        d['trigger'] = price + 10;
        d['price'] = price;
      }
    } else {
      d['price'] = price;
    }
    setOrderInput({
      ...orderInput,
      [pointer]: d,
    });
    setPointer(false);
  };

  useEffect(() => {
    const handleChartClick = param => {
      const price = Number(Series?.coordinateToPrice(param.point.y).toFixed(2));
      console.log('handleChartClick', price, param);
      if (pointer) {
        handleSLOrders(pointer, price);
      }
    };
    if (handleChartClickEvent) {
      Chart?.unsubscribeClick(handleChartClickEvent);
    }
    handleChartClickEvent = handleChartClick;
    Chart?.subscribeClick(handleChartClickEvent);
    return () => {
      Chart?.unsubscribeClick(handleChartClickEvent);
    };
  }, [init, pointer]);

  const placeOrder = transaction_type => {
    placeUpstoxOrder(
      symbol,
      quantitySize,
      transaction_type,
      enqueueSnackbar,
      feeds,
    );
  };

  const placeLimitPrice = type => {
    const data = {
      quantity: quantitySize,
      product: 'D',
      validity: 'DAY',
      price: type === 'SL' ? orderInput.SL.price : orderInput.LIMIT.price,
      tag: 'string',
      instrument_token: instrument,
      order_type: type === 'LIMIT' ? 'LIMIT' : 'SL',
      transaction_type:
        type === 'SL' ? ORDER.SELL : orderInput.type ? ORDER.BUY : ORDER.SELL,
      disclosed_quantity: 0,
      trigger_price: type === 'SL' ? orderInput.SL.trigger : 0,
      is_amo: false,
    };
    placeUpstoxOrder(symbol, 0, '', enqueueSnackbar, feeds, false, data, () => {
      getOrders();
    });
  };

  const cancelOrder = orderId => {
    upstoxClient.cancelOrder(orderId).then(response => {
      if (response?.status === 'success') {
        getOrders();
      }
    });
  };

  const onPointerSelect = type => {
    let newPointer = type;
    if (pointer === type) {
      newPointer = false;
    }
    setPointer(newPointer);
  };

  useEffect(() => {
    if (pointer) {
      Chart?.applyOptions({
        crosshair: {
          horzLine: {
            color: 'blue',
            style: 0,
          },
          vertLine: {
            color: 'transparent',
            width: 0,
          },
        },
      });
    } else {
      Chart?.applyOptions({
        crosshair: defaultCrossHairOptions(theme.palette.mode),
      });
    }
  }, [pointer]);

  const onOrderInputChange = (key, value) => {
    setOrderInput({ ...orderInput, [key]: value });
  };

  return (
    <Container>
      <Stack direction={'row'} height={'100vh'}>
        <Box position={'relative'}>
          <AppBar
            elevation={0}
            position="absolute"
            sx={{ top: 0, left: 0, width: '100%' }}
          >
            <Toolbar>
              <Typography variant="subtitle1" textTransform="uppercase">
                {getFormattedSymbolName(symbol)}
              </Typography>
              <Box flexGrow={1} />
              <Typography variant="h6" textTransform="uppercase">
                Fly Scalping +
              </Typography>
            </Toolbar>
          </AppBar>
          <div style={{ width: '100%', height: 300 }} ref={chartContainerRef} />
        </Box>
        <Box
          sx={{
            width: rightWindowWidth,
            borderLeft: theme => `1px solid ${alpha('#555', 0.5)}`,
          }}
        >
          <Stack height={'100vh'}>
            <Box height={'50vh'}>
              <Box p={2}>
                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                >
                  <Typography>All Positions</Typography>

                  <Stack direction={'row'} alignItems={'center'} spacing={2}>
                    <TimeClock />
                    <Stack
                      direction={'row'}
                      alignItems={'center'}
                      spacing={0.5}
                    >
                      <Typography>PL: </Typography>
                      <PostionsBar
                        showPercAtInit
                        showOnlyProfit
                        profitTypoStyles={{
                          minWidth: '0px',
                          paddingRight: '0px',
                          fontSize: '19px',
                        }}
                      />
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
              <Box p={1}>
                <PostionsBar disableActivePosition />
              </Box>
            </Box>
            <Box
              p={2}
              sx={{
                borderTop: theme => `1px solid ${alpha('#555', 0.5)}`,
              }}
            >
              <>
                <Stack>
                  <Stack direction="column" alignItems={'start'}>
                    <Typography variant="subtitle1" textTransform="uppercase">
                      {getFormattedSymbolName(symbol)}
                    </Typography>
                    <SocketTypo
                      fontSize={'26px'}
                      fontWeight={600}
                      showChangeDiff
                      showWithPerc
                      instrumentKey={instrument}
                    />
                    <Stack
                      mt={1}
                      direction={'row'}
                      alignItems={'center'}
                      spacing={1}
                    >
                      <Button
                        color="error"
                        variant="contained"
                        disableElevation
                        onClick={() => placeOrder(ORDER.SELL)}
                      >
                        Sell
                      </Button>
                      {quantityInfo && (
                        <QuantityInput
                          quantityInfo={quantityInfo}
                          value={quantitySize || quantityInfo?.lot_size}
                          onChange={onChangeQuantitySize}
                        />
                      )}

                      <Button
                        color="success"
                        disableElevation
                        variant="contained"
                        onClick={() => placeOrder(ORDER.BUY)}
                      >
                        Buy
                      </Button>
                    </Stack>
                    <Stack mt={2} direction={'row'} width={'100%'} spacing={2}>
                      <Box sx={{ width: '50%' }}>
                        <Card
                          sx={{ width: '100%', p: 2 }}
                          variant={
                            theme.palette.mode === 'light'
                              ? 'outlined'
                              : 'elevation'
                          }
                          color="info"
                          icon={false}
                        >
                          <AlertTitle
                            component={Stack}
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            <IconButton
                              onClick={() => onPointerSelect('LIMIT')}
                            >
                              <MyLocationIcon
                                color={pointer === 'LIMIT' ? 'info' : 'action'}
                              />
                            </IconButton>
                            <Typography
                              fontSize={'inherit'}
                              fontWeight={'inherit'}
                            >
                              LIMIT
                            </Typography>
                            <BuySellSwitch
                              value={
                                orderInput.type === ORDER.BUY ? true : false
                              }
                              onChange={v =>
                                onOrderInputChange(
                                  'type',
                                  v ? ORDER.BUY : ORDER.SELL,
                                )
                              }
                            />
                          </AlertTitle>
                          <Stack spacing={1}>
                            <Stack
                              direction={'row'}
                              alignItems={'center'}
                              spacing={1}
                            >
                              <Typography>Price: </Typography>
                              <OutlinedInput
                                value={orderInput?.LIMIT?.price}
                                type="number"
                                size="small"
                              />
                            </Stack>
                            <Stack>
                              <Button
                                onClick={() => placeLimitPrice('LIMIT')}
                                color={
                                  orderInput.type === ORDER.BUY
                                    ? 'primary'
                                    : 'error'
                                }
                                variant="contained"
                                disableElevation
                              >
                                {orderInput.type === ORDER.BUY ? 'BUY' : 'SELL'}
                              </Button>
                            </Stack>
                          </Stack>
                        </Card>
                      </Box>
                      <Box sx={{ width: '50%' }}>
                        <Card
                          sx={{ width: '100%', p: 2 }}
                          variant={
                            theme.palette.mode === 'light'
                              ? 'outlined'
                              : 'elevation'
                          }
                          color="info"
                          icon={false}
                        >
                          <AlertTitle
                            component={Stack}
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            {' '}
                            <IconButton onClick={() => onPointerSelect('SL')}>
                              <MyLocationIcon
                                color={pointer === 'SL' ? 'info' : 'action'}
                              />
                            </IconButton>
                            <Typography
                              fontSize={'inherit'}
                              fontWeight={'inherit'}
                            >
                              SL
                            </Typography>
                            {/* <BuySellSwitch
                              value={
                                orderInput.type === ORDER.BUY ? true : false
                              }
                              onChange={v => onOrderInputChange('type', v)}
                            /> */}
                          </AlertTitle>
                          <Stack spacing={1}>
                            <Stack
                              direction={'row'}
                              alignItems={'center'}
                              spacing={1}
                            >
                              <Typography>Limit: </Typography>
                              <OutlinedInput
                                value={orderInput?.SL?.price}
                                type="number"
                                size="small"
                              />
                            </Stack>
                            <Stack
                              direction={'row'}
                              alignItems={'center'}
                              spacing={1}
                            >
                              <Typography>Trigger: </Typography>
                              <OutlinedInput
                                value={orderInput?.SL?.trigger}
                                type="number"
                                size="small"
                              />
                            </Stack>
                            <Stack>
                              <Button
                                onClick={() => placeLimitPrice('SL')}
                                color={'error'}
                                variant="contained"
                                disableElevation
                              >
                                SELL
                              </Button>
                            </Stack>
                          </Stack>
                        </Card>
                      </Box>
                    </Stack>
                    <PendingOrders
                      pendingOrders={pendingOrders}
                      cancelOrder={cancelOrder}
                    />
                  </Stack>
                </Stack>
              </>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}

export default OptionTrade;
