import {
  Box,
  Button,
  Chip,
  Divider,
  FormControlLabel,
  FormGroup,
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
import { CheckCircle, ExitToApp } from '@mui/icons-material';
import { formaToINR } from '../../common/utils';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ErrorIcon from '@mui/icons-material/Error';

const OtherAccounts = ({ key, account, mini }) => {
  const [tokens, setToken] = useAtom(stores.tokens);
  const [mainAccountActive, setMainAccountActive] = useAtom(
    stores.mainAccountActive,
  );
  const [accountsStatus, setAccountStatus] = useAtom(stores.accountsStatus);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState();
  const [loadingText, setLoadingText] = useState();
  const [text, setText] = useState('');
  let [funds, setFunds] = useState(false);
  const token = tokens?.[account?.key];

  const getFunds = _token => {
    upstoxClient.getMultiFundMargin(_token || token).then(res => {
      console.log('getFunds', res);
      if (res?.data?.equity) {
        setFunds(res?.data?.equity);
      }
    });
  };
  useEffect(() => {
    setLoading(true);
    if (token) {
      upstoxClient.isActiveToken(token, user => {
        console.log('user', user);
        setLoading(false);
        if (user) {
          setActive(user);
          getFunds();
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
        setActive(user);
        getFunds(text);
      }
    });
  };
  const onAccStatusChange = e => {
    setAccountStatus({ ...accountsStatus, [account?.key]: e.target.checked });
  };
  const onMainAccActiveChange = e => {
    const { checked } = e.target;
    if (checked) {
      const status = {};
      if (typeof accountsStatus === 'object') {
        Object.keys(accountsStatus).map(key => {
          status[key] = false;
        });
        setAccountStatus(status);
      }
    }
    setMainAccountActive(checked ? token : '');
    setTimeout(() => {
      location.reload();
    }, 400);
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
          <Typography
            variant="subtitle2"
            fontWeight={600}
            sx={{
              opacity: accountsStatus?.[account.key] ? 1 : 0.4,
              width: mini ? '170px' : 'auto',
              whiteSpace: mini ? 'nowrap' : 'initial',
              overflow: mini ? 'hidden' : 'initial',
              textOverflow: mini ? 'ellipsis' : 'initial',
            }}
          >
            {account.name}
          </Typography>
          <Box>
            {active ? (
              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                {!mini && (
                  <>
                    <Chip
                      label={active?.user_id}
                      size="small"
                      color="info"
                      sx={{ fontWeight: 600 }}
                    />
                  </>
                )}

                <Chip
                  icon={<CheckCircle />}
                  label="Token"
                  color="success"
                  size="small"
                />

                <Switch
                  size="small"
                  checked={accountsStatus?.[account.key] || false}
                  onChange={onAccStatusChange}
                />
                {funds && !mini && (
                  <Chip
                    icon={<AccountBalanceWalletIcon sx={{ fontSize: 16 }} />}
                    sx={{ pl: 1 }}
                    label={
                      funds?.used_margin > 0
                        ? `${formaToINR(funds?.used_margin, true)} / ${formaToINR(funds?.available_margin + funds?.used_margin, true)}`
                        : `${formaToINR(funds?.available_margin)}`
                    }
                  />
                )}
                {!mini && (
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={mainAccountActive ? true : false}
                          onChange={onMainAccActiveChange}
                        />
                      }
                      label="Main Account"
                    />
                  </FormGroup>
                )}
              </Stack>
            ) : (
              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                <Chip
                  icon={<ErrorIcon />}
                  label="No Token"
                  color="error"
                  size="small"
                />
                {!mini && (
                  <>
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
                  </>
                )}
              </Stack>
            )}
          </Box>
        </Stack>
      )}
    </Box>
  );
};

export default OtherAccounts;
