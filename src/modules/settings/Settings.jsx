import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import { instrumentKeys } from '../../config';
import { useAtom } from 'jotai';
import { stores } from '../../store';
import QuantityInput from '../../components/QuantityInput';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

const quanitiesArray = [
  { name: 'Nifty', instrumentKey: instrumentKeys.NIFTY },
  { name: 'Bank Nifty', instrumentKey: instrumentKeys.BANKNIFTY },
  { name: 'Fin Nifty', instrumentKey: instrumentKeys.FINNIFTY },
  { name: 'Sensex', instrumentKey: instrumentKeys.SENSEX },
];

const Settings = () => {
  const [symbolQuantityInfo] = useAtom(stores.symbolQuantityInfo);
  const [quantitySizeInit, setQuantitySizeInit] = useAtom(
    stores.quantitySizeInit,
  );
  const onChangeQuantitySize = (instrumentKey, v) => {
    setQuantitySizeInit({ ...quantitySizeInit, [instrumentKey]: v });
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
    </Box>
  );
};
export default Settings;
