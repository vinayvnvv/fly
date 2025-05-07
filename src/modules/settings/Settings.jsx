import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  Input,
  OutlinedInput,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { instrumentKeys } from '../../config';
import { useAtom } from 'jotai';
import { stores } from '../../store';
import QuantityInput from '../../components/QuantityInput';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { Accounts } from '../../config/accounts';
import OtherAccounts from './OtherAccounts';
import { OpenInNew } from '@mui/icons-material';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

export const quanitiesArray = [
  { name: 'Nifty', instrumentKey: instrumentKeys.NIFTY },
  { name: 'Bank Nifty', instrumentKey: instrumentKeys.BANKNIFTY },
  { name: 'Fin Nifty', instrumentKey: instrumentKeys.FINNIFTY },
  { name: 'Sensex', instrumentKey: instrumentKeys.SENSEX },
];

const Settings = () => {
  const [symbolQuantityInfo] = useAtom(stores.symbolQuantityInfo);
  const [paperTrading, setPaperTrading] = useAtom(stores.paperTrading);
  const [bgImage, setBgImage] = useAtom(stores.bgImage);
  const token = localStorage.getItem('token');
  const [quantitySizeInit, setQuantitySizeInit] = useAtom(
    stores.quantitySizeInit,
  );
  const onChangeQuantitySize = (instrumentKey, v) => {
    setQuantitySizeInit({ ...quantitySizeInit, [instrumentKey]: v });
  };
  const onPaperTradingChange = e => {
    setPaperTrading(e.target.checked);
  };
  return (
    <Box>
      <Box>
        <Typography variant="subtitle1">Initial Quantity Size</Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={2}>
          {quanitiesArray.map(q => (
            <Stack
              spacing={2}
              key={q.instrumentKey}
              direction={'row'}
              alignItems={'center'}
            >
              <Typography
                sx={{ minWidth: '100px', textTransform: 'uppercase' }}
              >
                {q.name}
              </Typography>
              <QuantityInput
                quantityInfo={symbolQuantityInfo?.[q.instrumentKey]}
                value={quantitySizeInit?.[q.instrumentKey]}
                onChange={v => onChangeQuantitySize(q.instrumentKey, v)}
              />
              <IconButton
                size="small"
                onClick={() =>
                  onChangeQuantitySize(
                    q.instrumentKey,
                    symbolQuantityInfo?.[q.instrumentKey].minimum_lot,
                  )
                }
              >
                <RefreshRoundedIcon
                  fontSize="small"
                  sx={{ color: 'text.primary' }}
                />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      </Box>
      <Box mt={6}>
        <Typography variant="subtitle1">Trading</Typography>
        <Divider sx={{ my: 2 }} />
        <FormGroup sx={{ display: 'inline-flex' }}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={
                  paperTrading === 'true' || paperTrading === true
                    ? true
                    : false
                }
                onChange={onPaperTradingChange}
              />
            }
            labelPlacement="start"
            label="Paper Trading"
          />
        </FormGroup>
      </Box>
      <Box mt={6}>
        <Typography variant="subtitle1">Appearance</Typography>
        <Divider sx={{ my: 2 }} />
        <Stack direction={'row'} alignItems={'center'} spacing={3}>
          <Typography>Background Image</Typography>
          <OutlinedInput
            size="small"
            placeholder="url"
            onChange={e => setBgImage(e.target.value)}
            value={bgImage}
          />
        </Stack>
      </Box>
      <Box mt={6}>
        <Typography variant="subtitle1">Apps</Typography>
        <Divider sx={{ my: 2 }} />
        <Stack direction={'row'} alignItems={'center'} spacing={3}>
          <Typography>Token Pass To FlyCharts(Live ticks)</Typography>
          <Button
            href={`https://flycharts.web.app/store-key/${token}`}
            target="_blank"
            component={'a'}
            startIcon={<OpenInNew />}
          >
            Live Data
          </Button>
        </Stack>
      </Box>
      <Box mt={6}>
        <Typography variant="subtitle1">Fyers Login</Typography>
        <Divider sx={{ my: 2 }} />
        <Stack direction={'row'} alignItems={'center'} spacing={3}>
          <Typography>Click here to login to Fyers</Typography>
          <Button
            href={`/fyers-login`}
            variant="outlined"
            component={'a'}
            endIcon={<KeyboardDoubleArrowRightIcon />}
          >
            Login
          </Button>
        </Stack>
      </Box>
      <Box mt={6}>
        <Typography variant="subtitle1">Other Accounts</Typography>
        <Divider sx={{ my: 2 }} />
        {Accounts.map(account => (
          <OtherAccounts account={account} key={account.key} />
        ))}
      </Box>
    </Box>
  );
};

export default Settings;
