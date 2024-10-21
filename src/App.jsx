import {
  Box,
  CircularProgress,
  Container,
  Paper,
  Stack,
  ThemeProvider,
  styled,
} from '@mui/material';
import './App.css';
import CssBaseline from '@mui/material/CssBaseline';
import Papa from 'papaparse';
import { MaterialDesignContent, SnackbarProvider } from 'notistack';

import { theme } from './config/theme';
import Layout from './Layout';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { filteredSymbols, stores, token } from './store';
import { fyers } from './config/fyers';
import { upstoxClient } from './config/upstox';
import { filterSymbols, getColorWithThemeMode } from './common/utils';
import SocketUpdate from './SocketUpdate';
import InitApp from './InitApp';
import ThemeSwitch from './components/ThemeSwitch';
import PageLoader from './components/PageLoader';

const StyledMaterialDesignContent = styled(MaterialDesignContent)(
  ({ theme }) => ({
    '&.notistack-MuiContent-info': {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      borderLeft: `9px solid ${theme.palette.info.main}`,
    },
    '&.notistack-MuiContent-success': {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      borderLeft: `9px solid ${theme.palette.success.main}`,
    },
    '&.notistack-MuiContent-error': {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      borderLeft: `9px solid ${theme.palette.error.main}`,
    },
  }),
);

const Fab = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 31,
  right: 31,
}));

function App() {
  const [authToken] = useAtom(token);
  const [mode] = useAtom(stores.theme);
  const [init, setInit] = useState(false);
  const [socketInit, setSocketInit] = useState(false);
  const appInit = authToken ? init && socketInit : true;
  return (
    <ThemeProvider theme={theme({ mode })}>
      <SnackbarProvider
        maxSnack={6}
        preventDuplicate={true}
        hideIconVariant
        Components={{
          info: StyledMaterialDesignContent,
          error: StyledMaterialDesignContent,
          success: StyledMaterialDesignContent,
        }}
      >
        <CssBaseline />
        {authToken && (
          <>
            <InitApp onInit={() => setInit(true)} />
            <SocketUpdate onInit={() => setSocketInit(true)} />
          </>
        )}

        {appInit ? (
          <Layout />
        ) : (
          <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'center'}
            sx={{ height: '100vh' }}
          >
            <PageLoader />
          </Stack>
        )}
        <Fab>
          <ThemeSwitch />
        </Fab>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
