import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Paper,
  Stack,
  Typography,
  alpha,
  lighten,
  styled,
  useTheme,
} from '@mui/material';
import {
  exitAllPositions,
  formaToINR,
  getColorWithThemeMode,
  getGreenTextColor,
  getRedTextColor,
} from '../common/utils';
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

const PostionsBar = () => {
  const theme = useTheme();
  const profit = useRef();
  const { enqueueSnackbar } = useSnackbar();
  const [showActive, setShowActive] = useState(false);
  let positionExists = false;
  let totalProfit = 0;
  const [symbols] = useAtom(symbolsObjects);
  const [feeds] = useAtom(stores.marketFeed);
  const [positions] = useAtom(stores.positions);
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

  const exitAll = () => {
    exitAllPositions(positions?.data, symbols, enqueueSnackbar);
  };

  return (
    <>
      <Paper sx={{ marginBottom: '16px', py: 1, px: 2 }} variant="outlined">
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
                    <TableCell sx={{ textAlign: 'left' }}>Instrument</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">LTP</TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right">P&L</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {positions?.data
                    ?.filter(i => (showActive ? i.quantity !== 0 : true))
                    .map(pos => {
                      return (
                        <OrderChip
                          feeds={feeds}
                          profit={profit.current}
                          data={pos}
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
                  <Stack direction={'row'} alignItems={'center'}>
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
                    <Divider
                      orientation="vertical"
                      sx={{ height: '23px', mx: 1.5 }}
                    />
                  </Stack>
                )}
                <Stack direction={'row'} alignItems={'center'}>
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
              </Stack>

              <Stack
                direction={'row'}
                alignItems={'center'}
                spacing={1}
                justifyContent={'flex-end'}
              >
                <Typography>PL:</Typography>
                <Typography
                  fontSize={'14px'}
                  fontWeight={600}
                  textAlign={'right'}
                  pr={2}
                  sx={{
                    color:
                      totalProfit >= 0
                        ? getGreenTextColor(theme)
                        : getRedTextColor(theme),
                    minWidth: '80px',
                  }}
                >
                  {totalProfit && totalProfit !== 'NaN'
                    ? formaToINR(totalProfit)
                    : ''}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </>
  );
};
export default PostionsBar;
