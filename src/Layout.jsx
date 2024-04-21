import { Box, Container, Toolbar } from '@mui/material';
import { AppBar } from './components';
import {
  Navigate,
  RouterProvider,
  useNavigate,
  Router,
  Outlet,
} from 'react-router-dom';
import { router } from './routes.jsx';
import { token } from './store';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { AppHeaderToolBar } from './components/AppBar';
import PostionsBar from './components/PostionsBar';

const buyMp3 = new URL('./assets/buy.mp3', import.meta.url).href;
const sellMp3 = new URL('./assets/sell.mp3', import.meta.url).href;

const AppLayout = () => {
  const [appToken] = useAtom(token);
  return (
    <Box sx={{ display: 'flex' }}>
      {appToken && <AppBar />}
      <Container component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppHeaderToolBar />
        {/* {appToken && <PostionsBar />} */}
        <Outlet />
      </Container>
      <audio style={{ display: 'none' }} id="buy-audio" src={buyMp3} />
      <audio style={{ display: 'none' }} id="sell-audio" src={sellMp3} />
    </Box>
  );
};

function Layout() {
  return <RouterProvider router={router(AppLayout)} />;
}
export default Layout;
