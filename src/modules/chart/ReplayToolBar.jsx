import {
  Box,
  Divider,
  Fade,
  IconButton,
  Paper,
  Stack,
  Unstable_TrapFocus,
} from '@mui/material';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import SkipNextOutlinedIcon from '@mui/icons-material/SkipNextOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import PauseOutlinedIcon from '@mui/icons-material/PauseOutlined';
import KeyboardTabOutlinedIcon from '@mui/icons-material/KeyboardTabOutlined';

const ReplayToolBar = ({
  open,
  playReplay,
  playReplayNext,
  replayClose,
  isPlaying,
  selectReplayBar,
}) => {
  return (
    <Unstable_TrapFocus open={open} disableAutoFocus disableEnforceFocus>
      <Fade appear={false} in={open}>
        <Box
          sx={{
            position: 'fixed',
            bottom: 61,
            left: 0,
            right: 0,
            m: 0,
            zIndex: 333,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Paper sx={{ p: 0.2 }}>
            <Stack direction={'row'} alignItems={'center'} spacing={0.4}>
              <IconButton onClick={selectReplayBar}>
                <KeyboardTabOutlinedIcon
                  sx={{ transform: 'rotateZ(180deg)' }}
                />
              </IconButton>
              <IconButton onClick={playReplay}>
                {isPlaying ? <PauseOutlinedIcon /> : <PlayArrowOutlinedIcon />}
              </IconButton>
              <Divider orientation="vertical" variant="middle" flexItem />
              <IconButton onClick={playReplayNext}>
                <SkipNextOutlinedIcon />
              </IconButton>
              <Divider orientation="vertical" variant="middle" flexItem />
              <IconButton onClick={replayClose}>
                {' '}
                <CloseOutlinedIcon />
              </IconButton>
            </Stack>
          </Paper>
        </Box>
      </Fade>
    </Unstable_TrapFocus>
  );
};

export default ReplayToolBar;
