import React, { useEffect, useRef, useState } from 'react';
import CalHeatmap from 'cal-heatmap';
import Tooltip from 'cal-heatmap/plugins/Tooltip';
import 'cal-heatmap/cal-heatmap.css';
import { useAtom } from 'jotai';
import { stores } from '../../store';
import { Box, Card, Stack, Typography } from '@mui/material';
import {
  formaToINR,
  getGreenTextColor,
  getRedTextColor,
} from '../../common/utils';
import dayjs from 'dayjs';

const rangeOnlyPositive = ['#a5d6a7', '#1b5e20'];
const rangeWithNegative = ['#6e0300', '#ffdfde', '#a5d6a7', '#1b5e20'];

const formatData = (positions, date) => {
  let total = 0;
  const positionsInstruments = Object.keys(positions);
  if (Array.isArray(positionsInstruments)) {
    positionsInstruments.forEach(key => {
      const pos = positions[key];
      total += pos.day_sell_value - pos.day_buy_value;
    });
  }
  return {
    day: { date, value: total },
    total,
  };
};

const getData = () => {
  const data = {
    day: [],
    total: 0,
    min: -1,
    max: -1,
    startDate: new Date(),
  };
  for (var i = 0, len = localStorage.length; i < len; i++) {
    var key = localStorage.key(i);
    if (key.startsWith('broker_positions_')) {
      var json = localStorage.getItem(key);
      var result = JSON.parse(json);
      const date = key.split('broker_positions_')[1];
      const _data = formatData(result, date);
      data.day.push(_data.day);
      if (data.min === -1) {
        data.min = _data.total;
        data.max = _data.total;
      }
      if (_data.total < data.min) {
        data.min = _data.total;
      }
      if (_data.total > data.max) {
        data.max = _data.total;
      }
      if (dayjs(date).isBefore(dayjs(data.startDate))) {
        data.startDate = date;
      }
      data.total = data.total + _data.total;
    }
  }
  return data;
};

function PL() {
  const ref = useRef();
  const heatMap = useRef();
  const [theme] = useAtom(stores.theme);
  const [pl, setPL] = useState({ total: 0 });
  const paint = () => {
    const { day, total, max, min, startDate } = getData();
    console.log(min, max, day, startDate);
    setPL({ ...pl, total });
    heatMap.current.paint(
      {
        date: { start: new Date(startDate) },
        theme: theme,
        domain: {
          type: 'month',
          gutter: 3,
        },
        scale: {
          color: {
            range: min < 0 ? rangeWithNegative : rangeOnlyPositive,
            interpolate: 'hsl',
            type: 'linear',
            domain: min < 0 ? [min, 0, 0, max] : [min, max],
          },
        },
        range: 12,
        subDomain: { type: 'day', radius: 2, height: 18, width: 18, gutter: 3 },
        itemSelector: ref?.current,
        data: {
          x: 'date',
          y: 'value',
          source: [...day],
        },
      },
      [
        [
          Tooltip,
          {
            text: function (date, value, dayjsDate) {
              return (
                (value ? formaToINR(value) + '' : 'No data') +
                ' on ' +
                dayjsDate.format('LL')
              );
            },
          },
        ],
      ],
    );
  };
  useEffect(() => {
    heatMap.current = new CalHeatmap();
    heatMap.current.on('click', (event, timestamp, value) => {
      console.log(event, timestamp, value);
    });
    paint();
  }, []);
  useEffect(() => {
    paint();
  }, [theme]);
  return (
    <Box mt={3}>
      <Stack direction={'row'} mb={3}>
        <Card variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1">Net Profit</Typography>
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{
              color: theme =>
                pl?.total > 0
                  ? getGreenTextColor(theme)
                  : getRedTextColor(theme),
            }}
            mt={0.3}
          >
            {formaToINR(pl?.total)}
          </Typography>
        </Card>
      </Stack>
      <div ref={ref}></div>
    </Box>
  );
}

export default PL;
