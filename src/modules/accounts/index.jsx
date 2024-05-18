import { useEffect, useMemo, useState } from 'react';
import { Accounts as AcountsData } from '../../config/accounts';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { stores } from '../../store';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { upstoxClient } from '../../config/upstox';
import { useSnackbar } from 'notistack';
import { ExitToApp } from '@mui/icons-material';
import { removeQueryParams } from '../../common/utils';

const Accounts = () => {
  const { userId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [searchParams] = useSearchParams();
  const [tokens, setToken] = useAtom(stores.tokens);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState();
  const account = useMemo(() => {
    return AcountsData.find(ac => ac.key === userId);
  }, []);
  const token = tokens?.[account?.key];
  useEffect(() => {
    setLoading(true);
    const authCode = searchParams.get('code');
    removeQueryParams(['code']);
    if (authCode) {
      upstoxClient
        .getToken(
          authCode,
          account.VITE_UPSTOX_API_KEY,
          account.VITE_UPSTOX_API_SECRET,
          account.VITE_UPSTOX_API_REDIRECT_URL,
        )
        .then(res => {
          setToken({ ...tokens, [account?.key]: res.access_token });
          setActive(res.access_token);
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
        });
      return;
    }
    if (token) {
      upstoxClient.isActiveToken(token, user => {
        console.log('user', user);
        setLoading(false);
        if (user) setActive(token);
      });
      return;
    }
    setLoading(false);
  }, []);
  const login = () => {
    upstoxClient.redirectToLogin(
      account.VITE_UPSTOX_API_KEY,
      account.VITE_UPSTOX_API_REDIRECT_URL,
    );
  };
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          minWidth: '400px',
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          overflow: 'hidden',
          maxWidth: '600px',
          padding: '21px',
        }}
      >
        <Button
          disableRipple
          sx={{ mb: 2 }}
          onClick={() => {
            enqueueSnackbar('Copied!', {
              variant: 'success',
              anchorOrigin: { horizontal: 'center', vertical: 'top' },
            });
            navigator.clipboard.writeText(account?.phone);
          }}
        >
          {account?.phone}
        </Button>
        {loading ? (
          <CircularProgress variant="indeterminate" />
        ) : active ? (
          <Alert severity="success">
            <AlertTitle sx={{ fontWeight: 600 }}>Token Active</AlertTitle>
            <Stack direction={'row'} alignItems={'center'} spacing={1}>
              <TextField variant="standard" value={token} size="small" />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(token);
                  enqueueSnackbar('Copied!', {
                    variant: 'success',
                    anchorOrigin: { horizontal: 'center', vertical: 'top' },
                  });
                }}
              >
                Copy
              </Button>
            </Stack>
          </Alert>
        ) : (
          <Box>
            <Button onClick={login} variant="contained" endIcon={<ExitToApp />}>
              Login
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};
export default Accounts;
