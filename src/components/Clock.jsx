import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useState, useEffect, useRef } from 'react';

const mp3Url = new URL('./../assets/bell.mp3', import.meta.url).href;

const TimeClock = () => {
  const [time, setTime] = useState(new Date());
  const audioRef = useRef();
  useEffect(() => {
    const interval = setInterval(() => {
      // const currentTime = dayjs();
      // const targetTime = dayjs().set({ hour: 18, minute: 53, second: 0 });
      // if (currentTime.isSame(targetTime, 'minute')) {
      //   console.log('time');
      // }
      setTime(new Date());
    }, 1000);

    // setTimeout(() => {
    //   audioRef.current?.play();
    // }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Typography variant="subtitle2" fontWeight={600}>
        {dayjs(time).format('hh:mm:ss')}
      </Typography>
      {/* <audio ref={audioRef} src={mp3Url} /> */}
    </>
  );
};

export default TimeClock;
