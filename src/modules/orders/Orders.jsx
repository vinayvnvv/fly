import {
  Box,
  Chip,
  Paper,
  Typography,
  alpha,
  lighten,
  styled,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { upstoxClient } from '../../config/upstox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead, { tableHeadClasses } from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useAtom } from 'jotai';
import { stores, symbolsObjects } from '../../store';
import moment from 'moment';
import {
  getColorWithThemeMode,
  getFormattedSymbolName,
} from '../../common/utils';

const StyledTable = styled(Table)(({ theme }) => ({
  [`& .${tableHeadClasses.root}`]: {
    [`& .${tableCellClasses.root}`]: {
      fontSize: '9px',
      color: 'grey',
    },
  },
  [`& .${tableCellClasses.root}`]: {
    borderBottomColor: getColorWithThemeMode(
      theme,
      lighten(theme.palette.divider, 0.5),
      alpha(theme.palette.divider, 0.06),
    ),
  },
}));

const Orders = () => {
  const [orders, setOrders] = useState();
  const [symbols] = useAtom(symbolsObjects);
  //   const [symbols] = useAtom(stores.symbols);
  useEffect(() => {
    upstoxClient.getOrderBook().then(response => {
      setOrders(response?.data?.reverse());
    });
  }, []);
  console.log(orders);
  return (
    <Box mt={1}>
      <Typography variant="subtitle2" mb={2}>
        Orders {orders?.length > 0 ? `(${orders.length})` : ''}
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <StyledTable
          size="small"
          sx={{ minWidth: 650 }}
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell align="right">
                <Typography color={'GrayText'} fontSize={11}>
                  Qty
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color={'GrayText'} fontSize={11}>
                  Avg
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color={'GrayText'} fontSize={11}>
                  Time
                </Typography>
              </TableCell>
              <TableCell align="right">
                {' '}
                <Typography color={'GrayText'} fontSize={11}>
                  Type
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders?.map(row => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row" width={'38px'}>
                  {row.transaction_type === 'SELL' ||
                  row.status === 'rejected' ? (
                    <Chip
                      label={row.status === 'rejected' ? 'REJECTED' : 'SELL'}
                      size="small"
                      sx={{
                        borderRadius: 1,
                        fontSize: 11,
                        fontWeight: 500,
                        color: theme =>
                          getColorWithThemeMode(
                            theme,
                            theme.palette.error.main,
                            theme.palette.error.dark,
                          ),
                        backgroundColor: theme =>
                          getColorWithThemeMode(
                            theme,
                            lighten(theme.palette.error.main, 0.9),
                            alpha(theme.palette.error.main, 0.1),
                          ),
                      }}
                    />
                  ) : (
                    <Chip
                      label={'BUY'}
                      size="small"
                      sx={{
                        borderRadius: 1,
                        fontSize: 11,
                        color: theme => theme.palette.success.main,
                        backgroundColor: theme =>
                          getColorWithThemeMode(
                            theme,
                            lighten(theme.palette.success.main, 0.9),
                            alpha(theme.palette.success.main, 0.1),
                          ),
                      }}
                    />
                  )}
                </TableCell>
                <TableCell
                  width={'30%'}
                  component="th"
                  scope="row"
                  align="left"
                  sx={{ textTransform: 'uppercase' }}
                >
                  <Typography fontSize={'12px'}>
                    {getFormattedSymbolName(symbols[row.instrument_token]) ||
                      row.trading_symbol}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography fontSize={'12px'}>
                    {row.filled_quantity}/{row.quantity}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography fontSize={'12px'}>{row.average_price}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography fontSize={'12px'}>
                    {moment(row.order_timestamp).format('hh:mm:ss')}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {' '}
                  <Typography fontSize={'12px'}>{row.order_type}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </TableContainer>
    </Box>
  );
};
export default Orders;
