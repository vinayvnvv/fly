import * as React from 'react';
import { styled } from '@mui/material/styles';
import FastRewindOutlinedIcon from '@mui/icons-material/FastRewindOutlined';
import HorizontalRuleOutlinedIcon from '@mui/icons-material/HorizontalRuleOutlined';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, {
  toggleButtonGroupClasses,
} from '@mui/material/ToggleButtonGroup';
import { ChartTimeFrames } from '../../config';
import { Box, Button, IconButton } from '@mui/material';
import { DeleteOutlineOutlined } from '@mui/icons-material';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import logo from './../../../public/icon.png';
import { Link } from 'react-router-dom';
import { linesMap } from './Chart';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    margin: theme.spacing(0.5),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    [`&.${toggleButtonGroupClasses.disabled}`]: {
      border: 0,
    },
  },
  [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]:
    {
      marginLeft: -1,
      borderLeft: '1px solid transparent',
    },
}));

export default function Header({
  toolbar,
  setToolBar,
  deleteLine,
  deleteAllDrawing,
}) {
  const handleToolbar = (event, newFormats) => {
    const newData = {
      lineDraw: false,
      replay: false,
    };
    if (newFormats.indexOf('lineDraw') !== -1) {
      newData['lineDraw'] = true;
    }
    if (newFormats.indexOf('replay') !== -1) {
      newData['replay'] = true;
    }
    setToolBar({ ...toolbar, ...newData });
  };
  const groupData = [];
  if (toolbar.lineDraw) groupData.push('lineDraw');
  if (toolbar.replay) groupData.push('replay');

  return (
    <div>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          border: theme => `1px solid ${theme.palette.divider}`,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <Box mx={2}>
          <Link to={'/'}>
            <img src={logo} width={25} height={25} />
          </Link>
        </Box>
        <StyledToggleButtonGroup
          size="small"
          color="primary"
          value={toolbar.timeframe}
          exclusive
          onChange={(e, v) => setToolBar({ ...toolbar, timeframe: v })}
          aria-label="text alignment"
        >
          <ToggleButton
            value={ChartTimeFrames.MINUTE}
            aria-label="left aligned"
          >
            1m
          </ToggleButton>
          <ToggleButton value={ChartTimeFrames.MINUTE5} aria-label="justified">
            5m
          </ToggleButton>
          <ToggleButton value={ChartTimeFrames.DAY} aria-label="justified">
            D
          </ToggleButton>
        </StyledToggleButtonGroup>
        <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
        <StyledToggleButtonGroup
          size="small"
          color="primary"
          value={groupData}
          onChange={handleToolbar}
          aria-label="text formatting"
        >
          <ToggleButton value="lineDraw" aria-label="bold">
            <HorizontalRuleOutlinedIcon />
          </ToggleButton>
          <ToggleButton
            value="replay"
            aria-label="italic"
            selected={toolbar?.replayActive}
          >
            <FastRewindOutlinedIcon />
            Replay
          </ToggleButton>
        </StyledToggleButtonGroup>
        {linesMap.size > 0 && (
          <Button onClick={deleteAllDrawing}>Delete All</Button>
        )}
        {toolbar?.deleteLineId && (
          <IconButton onClick={deleteLine}>
            <DeleteOutlineOutlined />
          </IconButton>
        )}
      </Paper>
    </div>
  );
}
