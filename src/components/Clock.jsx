import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';

const TimeClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Typography variant="subtitle2" fontWeight={600}>
      {dayjs(time).format('hh:mm:ss')}
    </Typography>
  );
};

export default TimeClock;
