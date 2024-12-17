import {
  Box,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
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

export const quanitiesArray = [
  { name: 'Nifty', instrumentKey: instrumentKeys.NIFTY },
  { name: 'Bank Nifty', instrumentKey: instrumentKeys.BANKNIFTY },
  { name: 'Fin Nifty', instrumentKey: instrumentKeys.FINNIFTY },
  { name: 'Sensex', instrumentKey: instrumentKeys.SENSEX },
];

const Settings = () => {
  const [symbolQuantityInfo] = useAtom(stores.symbolQuantityInfo);
  const [paperTrading, setPaperTrading] = useAtom(stores.paperTrading);
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
