import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import { AppBar } from './components';
import { RouterProvider, Outlet } from 'react-router-dom';
import { router } from './routes.jsx';
import { stores, token } from './store';
import { useAtom } from 'jotai';
import { AppHeaderToolBar } from './components/AppBar';
import AccountStatus from './components/AccountStatus';
import MainAccountStatus from './components/MainAccountStatus';

const buyMp3 = new URL('./assets/buy.mp3', import.meta.url).href;
const sellMp3 = new URL('./assets/sell.mp3', import.meta.url).href;

const AppLayout = () => {
  const [appToken] = useAtom(token);
  const [bgImage] = useAtom(stores.bgImage);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box
      sx={{
        display: 'flex',
        ...(bgImage
          ? {
              backgroundImage: `url(${bgImage})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              minHeight: '100vh',
            }
          : {}),
      }}
    >
      {appToken && <AppBar />}
      <Container component="main" sx={{ flexGrow: 1, p: isMobile ? 1.4 : 3 }}>
        <AppHeaderToolBar />
        {/* {appToken && <PostionsBar />} */}
        <Outlet />
      </Container>
      <audio style={{ display: 'none' }} id="buy-audio" src={buyMp3} />
      <audio style={{ display: 'none' }} id="sell-audio" src={sellMp3} />
      <AccountStatus />
    </Box>
  );
};

function Layout({ bgImage }) {
  return <RouterProvider router={router(AppLayout)} />;
}
export default Layout;
