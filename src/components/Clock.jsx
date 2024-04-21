import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useState, useEffect, useRef } from 'react';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

const mp3Url = new URL('./../assets/bell.mp3', import.meta.url).href;
const mp3BellSingle = new URL('./../assets/bell-single.mp3', import.meta.url)
  .href;

const isTimeIsMarketOpen = () => {
  const currentTime = dayjs();
  const startTime = dayjs().set('hour', 9).set('minute', 15).set('second', 0);
  const endTime = dayjs().set('hour', 9).set('minute', 15).set('second', 2);

  // Check if the current time is between the start and end time
  const isBetween = currentTime.isBetween(startTime, endTime);
  return isBetween;
};

const isTimeIsPreMarketClose = () => {
  const currentTime = dayjs();
  const startTime = dayjs().set('hour', 9).set('minute', 7).set('second', 44);
  const endTime = dayjs().set('hour', 9).set('minute', 7).set('second', 46);

  // Check if the current time is between the start and end time
  const isBetween = currentTime.isBetween(startTime, endTime);
  return isBetween;
};

const TimeClock = () => {
  const [time, setTime] = useState(new Date());
  const audioRef = useRef();
  const audioPreMarketRef = useRef();
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      if (isTimeIsMarketOpen()) {
        audioRef.current?.play();
      }
      if (isTimeIsPreMarketClose()) {
        audioPreMarketRef.current?.play();
      }
    }, 1000);

    document.body.click();
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Typography variant="subtitle2" fontWeight={600}>
        {dayjs(time).format('hh:mm:ss')}
      </Typography>
      <audio ref={audioRef} src={mp3Url} />
      <audio ref={audioPreMarketRef} src={mp3BellSingle} />
    </>
  );
};

export default TimeClock;
