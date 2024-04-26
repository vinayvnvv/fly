import {
  AppBar as MUIAppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
  styled,
  tabsClasses,
  Divider,
  tabClasses,
  Stack,
} from '@mui/material';
import ThemeSwitch from './ThemeSwitch';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import TimeClock from './Clock';
import { formaToINR, getColorWithThemeMode } from '../common/utils';
import SocketTypo from './SocketTypo';
import { instrumentKeys } from '../config';
import { useAtom } from 'jotai';
import { stores } from '../store';
import PostionsBar from './PostionsBar';

export const appBarHeight = {
  mobile: 40,
  desktop: 48,
};

export const AppHeaderToolBar = styled(Toolbar)(({ theme }) => ({
  minHeight: `${appBarHeight.desktop}px !important`,
  [theme.breakpoints.down('sm')]: {
    minHeight: `${appBarHeight.mobile}px !important`,
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  height: appBarHeight.desktop,
  [theme.breakpoints.down('sm')]: {
    height: appBarHeight.mobile,
  },
  [`& .${tabsClasses.flexContainer}`]: {
    height: '100%',
  },
  [`& .${tabsClasses.indicator}`]: {
    // maxWidth: '50px',
    backgroundColor: 'transparent',
    display: 'flex',
    height: '3px',
    justifyContent: 'center',
    [`&::after`]: {
      content: '" "',
      backgroundColor: theme.palette.primary.main,
      height: '3px',
      position: 'absolute',
      width: '30%',
      borderRadius: '3px 3px 0px 0px',
    },
  },
}));
const StyledTab = styled(props => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    // letterSpacing: '0.02rem',
    fontSize: '13px',
    fontWeight: 500,
    [`&:hover`]: {
      color: theme.palette.primary.main,
    },
    [`&:not(.${tabClasses.selected}):not(:hover)`]: {
      color: getColorWithThemeMode(theme, '#333', theme.palette.text.primary),
    },
  }),
);
const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Basket', path: '/basket' },
  { label: 'Orders', path: '/orders' },
  { label: 'Positions', path: '/positions' },
  { label: 'Settings', path: '/settings' },
];
const AppBar = () => {
  const [value, setValue] = useState(0);
  const [fundsMargins] = useAtom(stores.fundAndMargin);

  const location = useLocation();

  useEffect(() => {
    const { pathname } = location;
    if (pathname) {
      const idx = navLinks.findIndex(obj => obj['path'] === pathname);
      if (idx !== -1) {
        setValue(idx);
      }
    }
  }, [location]);

  console.log(location);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <MUIAppBar
      variant="outlined"
      color="transparent"
      elevation={0}
      position="fixed"
      sx={{
        zIndex: theme => theme.zIndex.drawer + 1,
        backgroundColor: 'background.paper',
      }}
    >
      <Container>
        <AppHeaderToolBar disableGutters>
          <Typography
            noWrap
            component="div"
            sx={{
              fontWeight: 900,
              fontSize: '23px',
              color: theme => theme.palette.primary.main,
              textShadow: theme => `1px -1px ${theme.palette.primary.main}`,
              letterSpacing: `0.12px`,
              transform: 'rotateZ(-8deg)',
              borderRadius: '50px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: theme => `1px solid ${theme.palette.primary.main}`,
            }}
          >
            fly
          </Typography>
          <Divider orientation="vertical" sx={{ height: '23px', mx: 1.5 }} />
          <TimeClock />
          <Divider orientation="vertical" sx={{ height: '23px', mx: 1.5 }} />
          <Stack ml={1}>
            <Stack direction={'row'} alignItems={'center'}>
              <Typography fontSize={11} fontWeight={600} mr={0.5}>
                NIFTY
              </Typography>
              <SocketTypo
                fontSize={11}
                isBold
                fontWeight={600}
                showWithPerc
                showChangeDiff
                instrumentKey={instrumentKeys.NIFTY}
              />
            </Stack>
            <Stack direction={'row'} alignItems={'center'}>
              <Typography fontSize={11} fontWeight={600} mr={0.5}>
                BANKNIFTY
              </Typography>
              <SocketTypo
                fontSize={11}
                isBold
                showWithPerc
                showChangeDiff
                fontWeight={600}
                instrumentKey={instrumentKeys.BANKNIFTY}
              />
            </Stack>
          </Stack>
          <Divider orientation="vertical" sx={{ height: '23px', mx: 1.5 }} />
          <Stack direction={'column'} alignItems={'center'}>
            <Typography fontSize={12} fontWeight={600} color={'GrayText'}>
              Mrgn Avail
            </Typography>
            <Typography fontSize={12} fontWeight={600}>
              {formaToINR(fundsMargins?.available_margin)}
            </Typography>
          </Stack>
          <Divider orientation="vertical" sx={{ height: '23px', mx: 1.5 }} />
          <Stack direction={'column'} alignItems={'flex-start'}>
            <Typography fontSize={9} fontWeight={600} color={'GrayText'}>
              PL
            </Typography>
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
          <Box flexGrow={1} />
          <StyledTabs
            sx={{ mr: 3 }}
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            {navLinks.map(nav => (
              <StyledTab
                key={nav.path}
                label={nav.label}
                component={NavLink}
                to={nav.path}
              />
            ))}
          </StyledTabs>
          <ThemeSwitch />
        </AppHeaderToolBar>
      </Container>
    </MUIAppBar>
  );
};

export default AppBar;
