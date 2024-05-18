import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  alpha,
  buttonClasses,
  lighten,
  styled,
  tableCellClasses,
  useTheme,
} from '@mui/material';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { stores } from '../store';
import moment from 'moment';
import SocketTypo from './SocketTypo';
import {
  formaToINR,
  getFormattedSymbolName,
  getGreenTextColor,
  getRedTextColor,
  placeUpstoxOrder,
} from '../common/utils';
import { ORDER } from '../config';
import { useSnackbar } from 'notistack';
import { Cancel } from '@mui/icons-material';
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';

const OrderChipContainer = styled(TableRow)(({ theme, quantity }) => ({
  [`& .${tableCellClasses.root}:not(.always-highlet)`]: {
    opacity: quantity === 0 ? 0.38 : 1,
  },
  [`& .${buttonClasses.root}`]: {
    width: '23px',
    minWidth: '23px',
    height: '23px',
    padding: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50em',
  },
  ['& .field']: {
    outline: 'none',
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    borderRadius: 7,
    fontSize: '11px',
    color: theme.palette.text.primary,
    paddingLeft: '5px',
    backgroundColor: 'transparent',
    maxWidth: '45px',
    fontWeight: 500,
    fontFamily: 'inherit',
    [`&::-webkit-outer-spin-button, &::-webkit-inner-spin-button`]: {
      webkitAppearance: 'none',
      margin: 0,
    },
  },
}));

const orderQuatity = 210;

const OrderChip = ({ data, key, profit, feeds, isMultiTrade, token }) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [symbols] = useAtom(stores.symbolsObjects);
  const symbol = symbols[data.instrument_token];
  const pl = profit?.[data.instrument_token];
  const lotSize = symbol?.lot_size;
  const [qty, setQuantity] = useState(lotSize);
  //   console.log(symbol, key, data);
  const onQuantityChange = e => {
    const {
      nativeEvent: { inputType },
    } = e;
    console.log('onQuantityChange', e.target.getBoundingClientRect());
    if (inputType === 'insertText' || inputType === 'deleteContentBackward') {
      let val = e.currentTarget.value;
      if (val) {
        if (parseInt(val) < 0) {
          val = 0;
        }
      }
      setQuantity(val);
    }
  };
  const onQuantityWheelChange = event => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setQuantity(prevValue => {
        let val = parseInt(prevValue || 0);
        const diff = val % lotSize;
        if (diff !== 0) {
          val = val - diff;
        }
        return val + lotSize;
      });
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setQuantity(prevValue => {
        let val = parseInt(prevValue);
        const diff = val % lotSize;
        if (diff !== 0) {
          val = val - diff;
          return val;
        }
        if (val >= 15) return val - lotSize;
      });
    }
  };
  const placeOrder = transaction_type => {
    placeUpstoxOrder(symbol, qty, transaction_type, enqueueSnackbar, feeds);
  };
  const exitAllQtyInSymbol = () => {
    placeUpstoxOrder(
      symbol,
      data.quantity,
      ORDER.SELL,
      enqueueSnackbar,
      feeds,
      token ? true : false,
    );
  };
  return (
    <OrderChipContainer quantity={data.quantity}>
      <TableCell component="th" scope="row">
        <Stack direction={'row'} alignItems={'center'} spacing={2}>
          <Typography
            variant="body2"
            fontSize={11}
            fontWeight={500}
            textTransform={'uppercase'}
          >
            {getFormattedSymbolName(symbol) || data.trading_symbol}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>
        {data.quantity !== 0 && (
          <Tooltip title="Exit all">
            <IconButton size="small" color="error" onClick={exitAllQtyInSymbol}>
              <Cancel fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </TableCell>
      <TableCell align="right">
        <Typography
          fontSize={'10px'}
          fontWeight={700}
          sx={{
            color: theme =>
              data.quantity !== 0 ? theme.palette.primary.main : 'grey',
          }}
        >
          {data.quantity}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <SocketTypo
          instrumentKey={data?.instrument_token}
          fontSize={'10px'}
          forceColor={'text.primary'}
          sx={{ color: theme => `${theme.palette.text.primary}!important` }}
        />
      </TableCell>
      <TableCell align="center" className="always-highlet">
        {!isMultiTrade && (
          <Stack direction={'row'} spacing={1} justifyContent={'flex-end'}>
            {data.quantity !== 0 && (
              <Button
                disableElevation
                variant="contained"
                color="error"
                onClick={() => placeOrder(ORDER.SELL)}
              >
                -
              </Button>
            )}
            <input
              className="field"
              onClick={e => console.log(e)}
              type="number"
              defaultValue={lotSize}
              onChange={onQuantityChange}
              onKeyDown={onQuantityWheelChange}
              step={lotSize}
              value={qty}
              max={orderQuatity}
            />
            <Button
              disableElevation
              variant="contained"
              onClick={() => placeOrder(ORDER.BUY)}
            >
              +
            </Button>
          </Stack>
        )}
      </TableCell>
      <TableCell align="right">
        <Typography
          fontSize={'13px'}
          flexGrow={1}
          fontWeight={500}
          textAlign={'right'}
          ml={1}
          sx={
            data.quantity !== 0
              ? {
                  color:
                    pl >= 0 ? getGreenTextColor(theme) : getRedTextColor(theme),
                }
              : {}
          }
        >
          {pl ? formaToINR(pl.toFixed(2)) : '0'}
        </Typography>
      </TableCell>
    </OrderChipContainer>
  );
};

export default OrderChip;
