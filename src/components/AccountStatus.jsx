import {
  Box,
  Button,
  Checkbox,
  Fade,
  FormControlLabel,
  FormGroup,
  Grow,
  IconButton,
  Paper,
  Popover,
  Popper,
  Tooltip,
  styled,
} from '@mui/material';
import { useRef, useState } from 'react';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import { Accounts } from '../config/accounts';
import OtherAccounts from '../modules/settings/OtherAccounts';
import { CloseRounded } from '@mui/icons-material';

const StyledFabButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: '100px',
  right: '60px',
  backgroundColor: theme.palette.primary.main,
  boxShadow: `rgba(0, 0, 0, 0.2) 0px 3px 5px -1px, rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, rgba(0, 0, 0, 0.12) 0px 1px 18px 0px`,
  color: '#fff',
  ['&:hover']: {
    backgroundColor: theme.palette.primary.main,
  },
}));

const AccountStatus = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const elRef = useRef();

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <Box>
      <Tooltip title="Accounts">
        <StyledFabButton
          size="large"
          ref={elRef}
          aria-describedby={id}
          onClick={handleClick}
        >
          {open ? <CloseRounded /> : <SwitchAccountIcon />}
        </StyledFabButton>
      </Tooltip>

      <Popper
        id={id}
        open={open}
        anchorEl={elRef?.current ? elRef?.current : anchorEl}
        onClose={handleClose}
        disableScrollLock
        placement="top"
      >
        <Grow in timeout={350}>
          <Paper sx={{ width: '280px', padding: '7px 9px', mb: 1 }}>
            {/* <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  value={alwaysShow}
                  onChange={e => setAlwaysShow(e.target.checked)}
                />
              }
              label="Always Show"
            />
          </FormGroup> */}
            {Accounts.map(account => (
              <OtherAccounts account={account} key={account.key} mini />
            ))}
          </Paper>
        </Grow>
      </Popper>
    </Box>
  );
};
export default AccountStatus;
