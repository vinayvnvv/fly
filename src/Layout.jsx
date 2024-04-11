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
    </Box>
  );
};

function Layout() {
  return <RouterProvider router={router(AppLayout)} />;
}
export default Layout;
