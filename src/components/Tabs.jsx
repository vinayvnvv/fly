import { default as MUITabs, tabsClasses } from '@mui/material/Tabs';
import Tab, { tabClasses } from '@mui/material/Tab';
import { useState } from 'react';
import { styled } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const StyledTabs = styled(MUITabs)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '4px',
  padding: '4px',
  width: 'auto',
  minHeight: 'initial',
  display: 'inline-flex',
  [`& .${tabsClasses.indicator}`]: {
    height: '100%',
    borderRadius: '4px',
  },
  [`& .${tabClasses.root}`]: {
    minHeight: 'initial',
    padding: '7px 22px',
    display: 'inline-flex',
    alignItems: 'center',
    minWidth: 'initial',
  },
  [`& .${tabClasses.selected}`]: {
    color: '#fff !important',
    position: 'relative',
    zIndex: 7,
  },
}));

const Tabs = ({ items = [], value, onChange }) => {
  return (
    <StyledTabs
      value={value}
      onChange={onChange}
      aria-label="basic tabs example"
    >
      {Array.isArray(items) &&
        items.map(item => <Tab label={item.name} key={item.id} />)}
    </StyledTabs>
  );
};

export default Tabs;
