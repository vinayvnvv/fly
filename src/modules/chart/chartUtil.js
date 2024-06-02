import moment from 'moment';
import { generateUID } from '../../common/utils';
import { linesMap } from './Chart';

export const handleChartClick = (param, series, chart, toolbar, callback) => {
  /**
   * handleChartClick
   *
   * @callback args = (freshToolbar, replayData).
   */
  console.log('click');
  const { hoveredObjectId } = param;
  if (toolbar?.replay) {
    callback(
      { ...toolbar, replay: false, replayActive: true },
      { time: param.time },
    );
  }
  if (hoveredObjectId) {
    callback({ ...toolbar, deleteLineId: hoveredObjectId });
    return;
  }
  if (toolbar && toolbar.lineDraw) {
    const id = generateUID();
    const y = Number(series.coordinateToPrice(param.point.y).toFixed(2));
    let priceLine = series.createPriceLine({
      id: id,
      price: y,
      color: '#000',
      lineWidth: 2,
      lineStyle: 2, // LineStyle.Dashed
      axisLabelVisible: true,
    });
    console.log('priceLine', priceLine);
    setTimeout(() => {
      priceLine.applyOptions({ color: '#cc0000' });
    }, [3000]);
    linesMap.set(id, priceLine);
    callback({ ...toolbar, lineDraw: false });
  }
};

export function convertTo5MinTimeframe(data) {
  // Helper function to round down date to nearest 5 minutes
  function roundDownToFiveMinutes(date) {
    const d = new Date(date);
    const minutes = d.getMinutes();
    d.setMinutes(minutes - (minutes % 5));
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d.toISOString();
  }

  // Group data by 5-minute intervals
  const groupedData = data.reduce((acc, curr) => {
    const key = roundDownToFiveMinutes(curr.date);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(curr);
    return acc;
  }, {});

  // Convert grouped data to 5-minute timeframe data
  const fiveMinuteData = Object.keys(groupedData).map(key => {
    const group = groupedData[key];
    return {
      open: group[0].open,
      high: Math.max(...group.map(item => item.high)),
      low: Math.min(...group.map(item => item.low)),
      close: group[group.length - 1].close,
      date: moment(key),
      time: moment(key).unix(),
    };
  });

  console.log('fiveMinuteData', fiveMinuteData);

  return [...fiveMinuteData];
}

export function calculateMovingAverageSeriesData(candleData, maLength) {
  const maData = [];

  for (let i = 0; i < candleData.length; i++) {
    if (i < maLength) {
      // Provide whitespace data points until the MA can be calculated
      maData.push({ time: candleData[i].time });
    } else {
      // Calculate the moving average, slow but simple way
      let sum = 0;
      for (let j = 0; j < maLength; j++) {
        sum += candleData[i - j].close;
      }
      const maValue = sum / maLength;
      maData.push({ time: candleData[i].time, value: maValue });
    }
  }

  return maData;
}
