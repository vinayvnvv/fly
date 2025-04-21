import { Paper, Stack, Typography } from '@mui/material';

const BuyFutures = ({ isMobile }) => {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack
        spacing={isMobile ? 1 : 3}
        direction={isMobile ? 'column' : 'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        {!isMobile && (
          <Stack>
            <Typography variant="subtitle2" fontWeight={600}>
              Buy Futures
            </Typography>
            <Typography variant="caption" color={'GrayText'}>
              Buy At Strike Price
            </Typography>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

export default BuyFutures;
