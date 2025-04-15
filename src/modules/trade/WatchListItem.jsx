import { RemoveCircle } from '@mui/icons-material';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Stack,
  Typography,
  Button,
  listItemSecondaryActionClasses,
} from '@mui/material';
import SocketTypo from '../../components/SocketTypo';
export const WatchListItem = ({ instrument, onRemoveInstrument }) => {
  return (
    <ListItem>
      <ListItemText
        primary={
          <Stack direction={'row'} spacing={2}>
            <Typography>{instrument?.trading_symbol}</Typography>
            <SocketTypo
              instrumentKey={instrument?.instrument_key}
              showChangeDiff
              showWithPerc
            />
          </Stack>
        }
        secondary={instrument?.exchange}
      />
      <ListItemSecondaryAction>
        <Stack direction={'row'} spacing={1}>
          <Button
            size="small"
            disableElevation
            variant="contained"
            onClick={() => onRemoveInstrument(instrument)}
            sx={{ px: 2, minWidth: '20px' }}
          >
            <Typography variant="caption">B</Typography>
          </Button>
          <Button
            variant="contained"
            size="small"
            disableElevation
            color="error"
            sx={{ px: 2, minWidth: '20px' }}
            onClick={() => onRemoveInstrument(instrument)}
          >
            <Typography variant="caption">S</Typography>
          </Button>
          <IconButton
            size="small"
            onClick={() => onRemoveInstrument(instrument)}
          >
            <RemoveCircle />
          </IconButton>
        </Stack>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
