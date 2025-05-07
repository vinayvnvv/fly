import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Paper,
  Stack,
  TableSortLabel,
  Typography,
  alpha,
  lighten,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  exitAllPositions,
  formaToINR,
  getColorWithThemeMode,
  getGreenTextColor,
  getRedTextColor,
} from '../common/utils';
import ShoppingBagTwoToneIcon from '@mui/icons-material/ShoppingBagTwoTone';
import OrderChip from './OrderChip';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAtom } from 'jotai';
import { stores, symbolsObjects } from '../store';
import { useEffect, useRef, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead, { tableHeadClasses } from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useSnackbar } from 'notistack';
import ConfirmButton from './ConfirmButton';
import { Controller } from '../common/controller';

export const StyledTable = styled(Table)(({ theme }) => ({
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

const PostionsBar = ({
  showOnlyProfit,
  profitTypoStyles,
  showPercAtInit,
  positionsData,
  disableActivePosition,
  token,
}) => {
  const theme = useTheme();
  const profit = useRef();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();
  const [showActive, setShowActive] = useState(false);
  const [sort, setSort] = useState('');
  const [showPerc, setShowPerc] = useState(showPercAtInit || false);
  let positionExists = false;
  let totalProfit = 0;
  const [symbols] = useAtom(symbolsObjects);
  const [feeds] = useAtom(stores.marketFeed);
  let [positions] = useAtom(stores.positions);
  if (positionsData) positions = positionsData;
  const [fundsMargins] = useAtom(stores.fundAndMargin);
  const margin = fundsMargins?.available_margin
    ? fundsMargins?.available_margin + fundsMargins?.used_margin
    : 0;
  useEffect(() => {
    const pos = positionsData || positions;
    Controller.setPositions(pos);
  }, [positionsData, positions]);
  const calcProfit = () => {
    if (!profit.current) profit.current = {};
    const { data } = positions || {};
    if (Array.isArray(data) && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        const d = data[i];
        if (d.quantity === 0) {
          profit.current[d.instrument_token] = d.pnl;
          totalProfit += d.pnl;
          continue;
        } else {
          positionExists = true;
          const tick = feeds?.[d.instrument_token];
          // console.log('tick', tick);
          if (tick) {
            // if (profit?.current?.[d.instrument_token]) {
            const pl =
              d.day_sell_value - d.day_buy_value + tick.ltpc.ltp * d.quantity;

            profit.current[d.instrument_token] = pl;
            totalProfit += pl;
            // console.log('pl', pl);
            // }
          } else {
            totalProfit += profit.current[d.instrument_token];
          }
        }
      }
    }
  };
  calcProfit();
  totalProfit = totalProfit.toFixed(2);

  const exitAll = exitHalf => {
    exitAllPositions(
      positions?.data,
      symbols,
      enqueueSnackbar,
      feeds,
      exitHalf,
      positionsData ? true : false,
    );
  };

  const percProfit = ((totalProfit * 100) / margin).toFixed(2);

  const ProfitTypo = () => {
    return (
      <Typography
        fontSize={'14px'}
        fontWeight={600}
        onClick={() => setShowPerc(!showPerc)}
        textAlign={'right'}
        pr={2}
        sx={{
          color:
            totalProfit >= 0
              ? getGreenTextColor(theme)
              : getRedTextColor(theme),
          minWidth: '80px',
          ...profitTypoStyles,
        }}
      >
        {showPerc
          ? `${percProfit}%`
          : totalProfit && totalProfit !== 'NaN'
            ? formaToINR(totalProfit)
            : ''}
      </Typography>
    );
  };

  let positionArray = positions?.data?.map(i => ({
    ...i,
    profit: profit?.current?.[i.instrument_token],
  }));
  if (sort === 'plAsc') {
    positionArray?.sort((a, b) => b.profit - a.profit);
  }
  if (sort === 'plDes') {
    positionArray?.sort((a, b) => a.profit - b.profit);
  }
  if (sort === 'symbolDes') {
    positionArray?.sort((a, b) =>
      a.trading_symbol.localeCompare(b.trading_symbol),
    );
  }
  if (sort === 'symbolAsc') {
    positionArray?.sort((a, b) =>
      b.trading_symbol.localeCompare(a.trading_symbol),
    );
  }

  if (positionArray && positionArray.length === 0) {
    return showOnlyProfit ? (
      <ProfitTypo />
    ) : (
      <Paper variant="outlined">
        <Stack
          sx={{
            height: '100%',
            padding: '30px',
            // backgroundColor: theme => theme.palette.background.paper,
          }}
          component={Paper}
          variant="outlined"
          direction={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          spacing={1}
        >
          <ShoppingBagTwoToneIcon sx={{ fontSize: 54, opacity: 0.5 }} />
          <Typography color={'GrayText'} variant="h6">
            No Positions.
          </Typography>
        </Stack>
      </Paper>
    );
  }

  console.log(positionArray, positionsData, 'positionArray');

  return (
    <>
      {!showOnlyProfit ? (
        <Paper sx={{ py: 1, px: 2, overflowX: 'auto' }} variant="outlined">
          <Box direction={'column'} alignItems={'center'}>
            <Box flexGrow={1}>
              {Array.isArray(positions?.data) && positions?.data.length > 0 && (
                <StyledTable
                  size="small"
                  sx={{ width: '100%' }}
                  aria-label="simple table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          textAlign: 'left',
                        }}
                      >
                        <TableSortLabel
                          onClick={() =>
                            setSort(
                              sort === 'symbolAsc' ? 'symbolDes' : 'symbolAsc',
                            )
                          }
                          active={sort === 'symbolDes' || sort === 'symbolAsc'}
                          direction={sort === 'symbolDes' ? 'desc' : 'asc'}
                        >
                          Instrument
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}></TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">LTP</TableCell>
                      {!isMobile && <TableCell align="right"></TableCell>}
                      <TableCell align="right">
                        <TableSortLabel
                          onClick={() =>
                            setSort(sort === 'plAsc' ? 'plDes' : 'plAsc')
                          }
                          active={sort === 'plDes' || sort === 'plAsc'}
                          direction={sort === 'plDes' ? 'desc' : 'asc'}
                        >
                          P&L
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {positionArray
                      ?.filter(i => (showActive ? i.quantity !== 0 : true))
                      .map(pos => {
                        return (
                          <OrderChip
                            feeds={feeds}
                            isMobile={isMobile}
                            profit={profit.current}
                            isMultiTrade={positionsData ? true : false}
                            data={pos}
                            token={token}
                            key={pos.instrument_token}
                          />
                        );
                      })}
                  </TableBody>
                </StyledTable>
              )}
            </Box>
            <Box>
              <Stack
                direction={'row'}
                py={1}
                alignItems={'center'}
                spacing={3}
                pl={2}
                justifyContent={'space-between'}
              >
                <Stack direction={'row'} alignItems={'center'}>
                  {positionExists && (
                    <Stack direction={'row'} alignItems={'center'} spacing={1}>
                      <ConfirmButton
                        variant="contained"
                        disableElevation
                        size="small"
                        sx={{ minWidth: '87px' }}
                        startIcon={<LogoutIcon />}
                        confirmText={'Confirm'}
                        onConfirm={exitAll}
                      >
                        Exit all
                      </ConfirmButton>
                      <ConfirmButton
                        variant="outlined"
                        disableElevation
                        size="small"
                        sx={{ minWidth: '87px' }}
                        startIcon={<LogoutIcon />}
                        confirmText={'Confirm'}
                        onConfirm={() => exitAll(true)}
                      >
                        Exit Half
                      </ConfirmButton>
                      <Divider
                        orientation="vertical"
                        sx={{ height: '23px', mx: 1.5 }}
                      />
                    </Stack>
                  )}
                  {!disableActivePosition && (
                    <Stack direction={'row'} alignItems={'center'} ml={1.5}>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              onChange={e => setShowActive(e.target.checked)}
                              value={showActive}
                            />
                          }
                          label="Active Positions"
                        />
                      </FormGroup>
                    </Stack>
                  )}
                </Stack>

                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  spacing={1}
                  justifyContent={'flex-end'}
                >
                  <Typography>PL:</Typography>
                  <ProfitTypo />
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Paper>
      ) : (
        <ProfitTypo />
      )}
    </>
  );
};
export default PostionsBar;
