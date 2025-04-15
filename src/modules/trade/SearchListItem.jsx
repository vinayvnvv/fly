import { AddCircle } from '@mui/icons-material';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';

export const SearchListItem = ({ instrument, onAddInstrument }) => {
  return (
    <ListItem>
      <ListItemText
        primary={instrument?.trading_symbol}
        secondary={instrument?.exchange}
      />
      <ListItemSecondaryAction>
        <IconButton onClick={() => onAddInstrument(instrument)}>
          <AddCircle />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
