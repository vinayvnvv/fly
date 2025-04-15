import {
  Box,
  Button,
  Divider,
  Input,
  InputBase,
  List,
  listItemClasses,
  Stack,
} from '@mui/material';
import { StyledPaper } from '../home/Home';
import { instruments } from '../../lib/indexDB';
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { stores } from '../../store';
import { SearchListItem } from './SearchListItem';
import { WatchListItem } from './WatchListItem';
import PostionsBar from '../../components/PostionsBar';

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const Trade = () => {
  const [search, setSearch] = useState('');
  const [instrumentsData, setInstrumentsData] = useState(null);
  const [instrumentsList, setInstrumentsList] = useAtom(stores.instruments);

  const onSearch = e => {
    const { value } = e.target;
    setSearch(value);
    if (!value) {
      setInstrumentsData(null);
    }
    if (value.length > 1) {
      instruments.searchByName(value).then(res => {
        setInstrumentsData(res.slice(0, 100));
      });
    }
  };

  const onAddInstrument = instrument => {
    setSearch('');
    setInstrumentsData(null);
    setInstrumentsList([...instrumentsList, instrument]);
  };

  const onRemoveInstrument = instrument => {
    setInstrumentsList(instrumentsList.filter(i => i.id !== instrument.id));
  };

  const debouncedSearch = debounce(onSearch, 300);
  return (
    <Stack direction={'row'} spacing={4}>
      <StyledPaper
        variant="outlined"
        sx={{
          flexGrow: 'initial',
          maxHeight: 'calc(100vh - 100px)',
          display: 'flex',
          flexDirection: 'column',
          width: '40%',
        }}
      >
        <Box p={2}>
          <InputBase
            fullWidth
            placeholder="Search instrument, Ex: Tata motors, nifty"
            onChange={debouncedSearch}
          />
        </Box>
        {(search || (instrumentsList && instrumentsList.length > 0)) && (
          <Divider />
        )}
        {search && !instrumentsData && <Box p={2}>Searching...</Box>}
        {search && instrumentsData && instrumentsData.length === 0 && (
          <Box p={2}>No results found</Box>
        )}
        {search && instrumentsData && instrumentsData.length > 0 && (
          <List sx={{ flexGrow: 1, overflow: 'auto' }}>
            {instrumentsData.map(instrument => (
              <SearchListItem
                key={instrument.id}
                instrument={instrument}
                onAddInstrument={onAddInstrument}
              />
            ))}
          </List>
        )}
        <List
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            [`& button`]: {
              opacity: 0,
            },
            [`&>.${listItemClasses.container}:hover button`]: {
              opacity: 1,
            },
          }}
        >
          {instrumentsList.map(instrument => (
            <WatchListItem
              key={instrument.id}
              instrument={instrument}
              onRemoveInstrument={onRemoveInstrument}
            />
          ))}
        </List>
      </StyledPaper>
      <StyledPaper variant="outlined">
        <PostionsBar />
      </StyledPaper>
    </Stack>
  );
};

export default Trade;
