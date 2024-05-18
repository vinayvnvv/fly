import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { stores } from '../../store';
import { Box, MenuItem, Select } from '@mui/material';
import { upstoxClient } from '../../config/upstox';
import PostionsBar from '../../components/PostionsBar';

const TradeX = () => {
  const [positions, setPositions] = useState([]);
  const [tokens] = useAtom(stores.tokens);
  const [user, setUser] = useState('');
  const tokensArr =
    tokens && typeof tokens === 'object' ? Object.keys(tokens) : [];
  const onUserChange = e => {
    const token = e.target.value;
    setUser(token);
  };
  const getPositions = token => {
    upstoxClient.getMultiPositions(token).then(res => {
      setPositions(res);
    });
  };
  useEffect(() => {
    if (tokensArr && tokensArr.length > 0) {
      const token = tokens[tokensArr[0]];
      setUser(token);
      getPositions(token);
    }
  }, []);
  return (
    <Box>
      <Box mb={2}>
        <Select
          value={user}
          variant="standard"
          onChange={onUserChange}
          size="small"
          sx={{ minWidth: 120 }}
        >
          {tokens &&
            typeof tokens === 'object' &&
            tokensArr.map(key => (
              <MenuItem key={key} value={tokens[key]}>
                {key}
              </MenuItem>
            ))}
        </Select>
      </Box>
      <PostionsBar positionsData={positions} token={user} />
    </Box>
  );
};
export default TradeX;
