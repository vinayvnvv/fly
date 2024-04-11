import { Typography, useTheme } from '@mui/material';
import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { stores, theme } from '../store';
import { MarketDataFeedSocket } from '../socket/market';
import {
  calculatePercentageChange,
  getGreenTextColor,
  getRedTextColor,
} from '../common/utils';

const SocketTypo = ({
  showWithPerc,
  showChangeDiff,
  isBoldForPositive,
  isBold,
  instrumentKey,
  forceColor,
  ...restProps
}) => {
  const theme = useTheme();
  const [feeds] = useAtom(stores.marketFeed);
  let prevVal = useRef();
  let styleRef = useRef();
  let prePercChange = useRef();
  let changeDiff = useRef();
  useEffect(() => {
    //   console.log('Socket instrumentKey subscribe', instrumentKey);
    MarketDataFeedSocket.subscribe(instrumentKey);
    return () => {
      MarketDataFeedSocket.unSubscribe(instrumentKey);
    };
  }, []);
  const feed = feeds?.[instrumentKey];
  let ltp = feed?.ltpc?.ltp;
  let cp = feed?.ltpc?.cp;
  if (ltp) {
    ltp = ltp.toFixed(2);
  }
  useEffect(() => {
    prevVal.current = ltp ? ltp : prevVal.current;
  }, [feeds]);
  const price = ltp ? ltp : prevVal?.current ? prevVal.current : '';

  if (
    (showWithPerc || showChangeDiff) &&
    cp !== null &&
    cp !== 0 &&
    price !== null &&
    price !== ''
  ) {
    if (showWithPerc) {
      const perc = calculatePercentageChange(cp, price);
      if (perc && typeof perc === 'number') {
        prePercChange.current = perc.toFixed(2);
      }
    }
    if (showChangeDiff) {
      const diff = price - cp;
      if (diff && typeof diff === 'number') {
        changeDiff.current = diff.toFixed(2);
      }
    }
  }
  if (isBold) restProps['fontWeight'] = 'bold';
  if (cp !== null && cp > 0 && price !== null && price !== '') {
    if (cp < price) {
      styleRef.current = {
        ['color']: getGreenTextColor(theme),
      };
      if (isBoldForPositive) {
        styleRef.current = {
          ...styleRef.current,
          ['fonWeight']: '600',
        };
      }
    }
    if (cp > price) {
      styleRef.current = {
        ['color']: getRedTextColor(theme),
      };
    }
  }
  return price ? (
    <Typography
      style={{ ...styleRef.current }}
      sx={{ color: theme => theme.palette.error.dark }}
      {...restProps}
    >
      {price}
      {showWithPerc ? ` (${prePercChange.current || '0.00'}%)` : ''}
      {showChangeDiff ? ` ${changeDiff.current || '0.00'}` : ''}
    </Typography>
  ) : (
    ''
  );
};
export default SocketTypo;
