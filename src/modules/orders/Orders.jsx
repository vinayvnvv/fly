import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  alpha,
  lighten,
  styled,
  useTheme,
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
import { ShoppingBagOutlined } from '@mui/icons-material';

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
      alpha(theme.palette.divider, 0.09),
    ),
  },
}));

const Orders = ({ initialOrders, fromFyers = false }) => {
  const [orders, setOrders] = useState(initialOrders);
  const [bgImage] = useAtom(stores.bgImage);
  const [tokens] = useAtom(stores.tokens);
  const [symbols] = useAtom(symbolsObjects);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState('me');
  const theme = useTheme();
  //   const [symbols] = useAtom(stores.symbols);

  const getOrders = async () => {
    setLoading(true);
    await upstoxClient.getOrderBook().then(response => {
      setOrders(response?.data?.reverse());
    });
    setLoading(false);
  };
  const getMultiOrders = token => {
    upstoxClient.getMultiOrderBook(token).then(response => {
      setOrders(response?.data?.reverse());
    });
  };
  useEffect(() => {
    if (initialOrders) {
      setOrders(initialOrders);
    } else {
      getOrders();
    }
  }, []);
  const onUserChange = e => {
    const token = e.target.value;
    setUser(token);
    if (token === 'me') {
      getOrders();
    } else {
      getMultiOrders(token);
    }
  };
  const totalOrders = orders?.filter(itm => itm.status === 'complete')?.length;
  const totalBuyOrders = orders?.filter(
    itm => itm.status === 'complete' && itm.transaction_type === 'BUY',
  )?.length;
  const totalSellOrders = orders?.filter(
    itm => itm.status === 'complete' && itm.transaction_type === 'SELL',
  )?.length;
  const StatsItem = ({ title, count, color }) => {
    return (
      <Box
        sx={{
          width: 100,
          height: 80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '10px',
          border: `2px solid ${color}`,
        }}
      >
        <Typography variant="h5" fontWeight={'700'} sx={{ color }}>
          {count}
        </Typography>
        <Typography variant="caption">{title}</Typography>
      </Box>
    );
  };
  const Title = () => {
    return (
      <Stack direction={'row'} alignItems={'center'} spacing={2} mb={2}>
        <Typography variant="subtitle2" sx={{ minWidth: 90 }}>
          Orders {orders?.length > 0 ? `(${orders.length})` : ''}
        </Typography>
        {!fromFyers && (
          <Select
            value={user}
            variant="standard"
            onChange={onUserChange}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value={'me'}>Me</MenuItem>
            {tokens &&
              typeof tokens === 'object' &&
              Object.keys(tokens).map(key => (
                <MenuItem key={key} value={tokens[key]}>
                  {key}
                </MenuItem>
              ))}
          </Select>
        )}
      </Stack>
    );
  };

  console.log('Orders', orders);
  if (loading)
    return (
      <Stack
        alignItems={'center'}
        justifyContent={'center'}
        sx={{ minHeight: 300 }}
      >
        <CircularProgress />
      </Stack>
    );
  if (orders && orders.length === 0) {
    return (
      <Box mt={1}>
        <Title />
        <Stack
          sx={{
            height: '100%',
            padding: '30px',
            backgroundColor: theme => theme.palette.background.paper,
          }}
          component={Paper}
          variant="outlined"
          direction={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          spacing={1}
        >
          <ShoppingBagOutlined sx={{ fontSize: 54, opacity: 0.5 }} />
          <Typography color={'GrayText'} variant="h6">
            No Orders.
          </Typography>
        </Stack>
      </Box>
    );
  }
  return (
    <Box mt={1}>
      <Title />
      <Box sx={{ my: 3 }}>
        <Stack direction={'row'} spacing={3}>
          <StatsItem
            title="Total Orders"
            count={totalOrders}
            color={theme.palette.info.main}
          />
          <StatsItem
            title="Buy Orders"
            count={totalBuyOrders}
            color={theme.palette.success.main}
          />
          <StatsItem
            title="Sell Orders"
            count={totalSellOrders}
            color={theme.palette.error.main}
          />
        </Stack>
      </Box>
      <Paper
        variant="outlined"
        sx={{ ...(!bgImage ? { backgroundColor: 'transparent' } : {}) }}
      >
        <TableContainer component={'div'} variant="outlined">
          <StyledTable
            size="small"
            sx={{ minWidth: 650 }}
            aria-label="a dense table"
          >
            <TableHead>
              <TableRow>
                <TableCell align="left">
                  <Typography color={'GrayText'} fontSize={11}>
                    Time
                  </Typography>
                </TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Instrument</TableCell>
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
                  {' '}
                  <Typography color={'GrayText'} fontSize={11}>
                    at
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
                  <TableCell align="left" width={'50px'}>
                    <Typography fontSize={'12px'}>
                      {moment(row.order_timestamp).format('hh:mm:ss')}
                    </Typography>
                  </TableCell>
                  <TableCell component="th" scope="row" width={'38px'}>
                    {row.status === 'rejected' ? (
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
                        label={'SUCCESS'}
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
                  <TableCell component="th" scope="row" width={'38px'}>
                    {row.transaction_type === 'SELL' ? (
                      <Chip
                        label={'SELL'}
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
                          color: theme => theme.palette.info.main,
                          backgroundColor: theme =>
                            getColorWithThemeMode(
                              theme,
                              lighten(theme.palette.info.main, 0.9),
                              alpha(theme.palette.info.main, 0.1),
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
                    <Typography fontSize={'12px'}>
                      {row.average_price}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Chip
                      label={row.order_type}
                      size="small"
                      sx={{ fontSize: 11, borderRadius: 1, fontWeight: 500 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        </TableContainer>
      </Paper>
    </Box>
  );
};
export default Orders;
