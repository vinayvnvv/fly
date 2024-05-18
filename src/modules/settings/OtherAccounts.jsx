import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { stores } from '../../store';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { upstoxClient } from '../../config/upstox';
import { ExitToApp } from '@mui/icons-material';

const OtherAccounts = ({ key, account }) => {
  const [tokens, setToken] = useAtom(stores.tokens);
  const [accountsStatus, setAccountStatus] = useAtom(stores.accountsStatus);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState();
  const [loadingText, setLoadingText] = useState();
  const [text, setText] = useState('');
  const token = tokens?.[account?.key];
  useEffect(() => {
    setLoading(true);
    if (token) {
      upstoxClient.isActiveToken(token, user => {
        console.log('user', user);
        setLoading(false);
        if (user) {
          setActive(token);
        } else {
          const _t = tokens;
          delete _t[account?.key];
          setToken({ ..._t });
        }
      });
      return;
    }
    setLoading(false);
  }, []);
  const addToken = () => {
    if (text.length < 5) return;
    setLoadingText(true);
    upstoxClient.isActiveToken(text, user => {
      console.log('user', user);
      setLoadingText(false);
      if (user) {
        setToken({ ...tokens, [account?.key]: text });
        setActive(text);
      }
    });
  };
  const onAccStatusChange = e => {
    setAccountStatus({ ...accountsStatus, [account?.key]: e.target.checked });
  };
  return (
    <Box key={key}>
      {loading ? (
        <Stack direction={'row'} alignItems={'center'} spacing={3}>
          <Skeleton variant="circular" width={10} height={10} />
          <Skeleton variant="rectangular" width={80} height={10} />
        </Stack>
      ) : (
        <Stack direction={'row'} alignItems={'center'} spacing={2}>
          <Typography variant="subtitle2" fontWeight={600}>
            {account.name}
          </Typography>
          <Box>
            {active ? (
              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                <Chip label="Active" color="success" size="small" />
                <Switch
                  checked={accountsStatus?.[account.key] || false}
                  onChange={onAccStatusChange}
                />
              </Stack>
            ) : (
              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                <Chip label="Not Active" color="error" size="small" />
                <Button
                  href={account.url}
                  variant="outlined"
                  target="_blank"
                  endIcon={<ExitToApp fontSize="small" />}
                >
                  Login
                </Button>
                <TextField
                  size="small"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Add Token"
                  InputProps={{
                    endAdornment: (
                      <Button
                        onClick={addToken}
                        size="small"
                        disableElevation
                        variant="contained"
                      >
                        {loadingText ? 'loading' : '+ Add'}
                      </Button>
                    ),
                  }}
                />
              </Stack>
            )}
          </Box>
        </Stack>
      )}
    </Box>
  );
};

export default OtherAccounts;
