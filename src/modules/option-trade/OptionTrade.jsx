import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  formatCandles,
  getFormattedSymbolName,
  placeUpstoxOrder,
  toggleAppBar,
} from '../../common/utils';
import { alpha, Box, Button, Stack, styled, Typography } from '@mui/material';
import { ColorType, createChart } from 'lightweight-charts';
import dayjs from 'dayjs';
import { upstoxClient } from '../../config/upstox';
import moment from 'moment';
import Positions from '../positions/Positions';
import { useAtom } from 'jotai';
import { stores } from '../../store';
import SocketTypo from '../../components/SocketTypo';
import PostionsBar from '../../components/PostionsBar';
import QuantityInput from '../../components/QuantityInput';
import { useSnackbar } from 'notistack';
import { ORDER } from '../../config';

const rightWindowWidth = 560;

const Container = styled(Box)(({ theme }) => ({
  width: '100vw',
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100vh',
  backgroundColor: theme.palette.background.paper,
  zIndex: 777,
}));
const candleOptions = {
  upColor: '#45dc4c',
  downColor: '#ee524e',
  borderUpColor: '#1e7224',
  borderDownColor: '#8d302d',
  wickDownColor: '#000000',
  wickUpColor: '#000000',
};
const defaultCrossHairOptions = {
  mode: 0,
  vertLine: {
    width: 1.2,
    visible: true,
    color: 'grey',
    style: 3,
  },
  horzLine: {
    width: 1.2,
    visible: true,
    color: 'grey',
    style: 3,
  },
};
let Chart;
let Series;
let open, low, high, time;
let avgPriceLine;
const toDate = moment().format('YYYY-MM-DD');
const fromDate = moment().subtract(10, 'days').format('YYYY-MM-DD');
let min = -1;
function OptionTrade() {
  const chartContainerRef = useRef();
  const search = useSearchParams();
  const [data, setData] = useState([]);
  const [init, setInit] = useState(false);
  const [symbols] = useAtom(stores.symbolsObjects);
  const [symbolQuantityInfo] = useAtom(stores.symbolQuantityInfo);
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

  useEffect(() => {
    const ltpc = feeds?.[instrument]?.ltpc;
    const _min = moment().format('mm');
    if (ltpc?.ltp && Series) {
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

  const initChart = initialData => {
    Chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'white' },
        textColor: 'black',
      },
      autoSize: false,
      width: window.innerWidth - rightWindowWidth,
      height: window.innerHeight,
      rightPriceScale: {
        autoScale: false,
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
      crosshair: defaultCrossHairOptions,
      localization: {
        locale: 'en-US',
        timeFormatter: v => {
          return dayjs.unix(v).format('ddd DD MMM  hh:mm:ss');
        },
      },
    });
    Chart.timeScale().fitContent();
    Series = Chart.addCandlestickSeries({ ...candleOptions });
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
    window.addEventListener('resize', handleResize);
    return () => {
      toggleAppBar(true);
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

  useEffect(() => {
    const handleChartClick = param => {
      console.log('click', param);
    };
    Chart?.subscribeClick(handleChartClick);
    return () => {
      Chart?.unsubscribeClick(handleChartClick);
    };
  }, [init]);

  const placeOrder = transaction_type => {
    placeUpstoxOrder(
      symbol,
      quantitySize,
      transaction_type,
      enqueueSnackbar,
      feeds,
    );
  };

  return (
    <Container>
      <Stack direction={'row'} height={'100vh'}>
        <Box>
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
