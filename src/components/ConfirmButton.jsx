import { Cancel, CancelOutlined } from '@mui/icons-material';
import { Button, Grow, IconButton, Slide, Stack, styled } from '@mui/material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { useRef, useState } from 'react';

const StyledStack = styled(Stack)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  left: 0,
  top: 0,
  zIndex: 4,
  color: 'inherit',
  overflow: 'hidden',
  borderRadius: '4px',
  ['& .canel_i']: {
    padding: 0,
    minWidth: '24px',
    height: '100%',
    borderRadius: 0,
    boxShadow: 'none',
  },
}));

const ConfirmButton = ({ confirmText, children, onConfirm, ...props }) => {
  const [confirm, setConfirm] = useState(false);
  const containerRef = useRef(null);
  const onOk = e => {
    e.preventDefault();
    e.stopPropagation();
    setConfirm(false);
    if (onConfirm) onConfirm();
  };
  const cancelConfirm = e => {
    e.preventDefault();
    e.stopPropagation();
    setConfirm(false);
  };
  const onClick = () => {
    setConfirm(true);
  };
  return (
    <Button
      {...props}
      sx={{ position: 'relative' }}
      onClick={onClick}
      ref={containerRef}
    >
      {children}
      {confirm && (
        <StyledStack direction={'row'} alignItems={'center'}>
          <Slide
            in={confirm}
            container={containerRef.current}
            direction="right"
          >
            <Button
              className="canel_i"
              variant="contained"
              size={props.size ? props.size : 'medium'}
              color="error"
              onClick={cancelConfirm}
            >
              <Cancel fontSize="small" />
            </Button>
          </Slide>
          <Slide in={confirm} container={containerRef.current} direction="left">
            <Button
              className="confirm_btn"
              variant="contained"
              onClick={onOk}
              sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              size={props.size ? props.size : 'medium'}
              color="success"
            >
              {confirmText || 'Confirm'}
            </Button>
          </Slide>
        </StyledStack>
      )}
    </Button>
  );
};
export default ConfirmButton;
