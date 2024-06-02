import dayjs from 'dayjs';
import { createChart, ColorType } from 'lightweight-charts';
import { useCallback, useEffect, useRef, useState } from 'react';
import Header from './Header';
import { upstoxClient } from '../../config/upstox';
import {
  findFirstOccurrenceDateIndex,
  formatCandles,
  splitArray,
} from '../../common/utils';
import { ChartTimeFrames } from '../../config';
import {
  calculateMovingAverageSeriesData,
  convertTo5MinTimeframe,
  handleChartClick,
} from './chartUtil';
import ReplayToolBar from './ReplayToolBar';
import moment from 'moment';

const toDate = moment().format('YYYY-MM-DD');
const fromDate = '2023-12-01';

const candleOptions = {
  upColor: '#45dc4c',
  downColor: '#ee524e',
  borderUpColor: '#1e7224',
  borderDownColor: '#8d302d',
  wickDownColor: '#000000',
  wickUpColor: '#000000',
};
const defaultCrossHairOptions = {
  mode: 0,
  vertLine: {
    width: 1.2,
    visible: true,
    color: 'grey',
    style: 3,
  },
  horzLine: {
    width: 1.2,
    visible: true,
    color: 'grey',
    style: 3,
  },
};
let Chart;
let Series;
let ChartData;
let toolbarData;
let nextDataSeries = [];
let replayInterval;
export let mouseStatus = 'up';
export const linesMap = new Map();
const ChartComponent = () => {
  const chartContainerRef = useRef();
  const [init, setInit] = useState(false);
  const [data, setData] = useState([]);
  const [toolbar, setToolBar] = useState({
    timeframe: ChartTimeFrames.MINUTE,
    lineDraw: false,
    replay: false,
    deleteLineId: false,
    replayActive: false,
    isPlaying: false,
  });
  const initChart = initialData => {
    Chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'white' },
        textColor: 'black',
      },
      autoSize: false,
      width: window.innerWidth,
      height: window.innerHeight - 52,
      rightPriceScale: {
        autoScale: false,
      },
      timeScale: {
        timeVisible: true,
        tickMarkFormatter: (time, tickMarkType) => {
          let str = '';
          if (tickMarkType === 2) {
            str = dayjs.unix(time).format('DD');
          } else if (tickMarkType === 0) {
            str = dayjs.unix(time).format('YYYY');
          } else if (tickMarkType === 1) {
            str = dayjs.unix(time).format('MMM');
          } else if (tickMarkType === 3) {
            str = dayjs.unix(time).format('hh:mm');
          } else if (tickMarkType === 4) {
            str = dayjs.unix(time).format('hh:mm:ss');
          }
          return str;
        },
      },
      crosshair: defaultCrossHairOptions,
      localization: {
        locale: 'en-US',
        timeFormatter: v => {
          return dayjs.unix(v).format('ddd DD MMM  hh:mm:ss');
        },
      },
    });
    Chart.timeScale().fitContent();
    Series = Chart.addCandlestickSeries({ ...candleOptions });
    setData(initialData);
    Series.setData(initialData);
    Chart?.timeScale().fitContent();
    setInit(true);
  };
  useEffect(() => {
    upstoxClient
      .getHistoricalCandle('NSE_INDEX|Nifty Bank', '1minute', toDate, fromDate)
      .then(res => {
        const _d = formatCandles(res) || [];
        initChart(_d);
      });
    const handleResize = () => {
      Chart?.applyOptions({ width: chartContainerRef.current.clientWidth });
    };
    const handleMouseDown = () => {
      mouseStatus = 'down';
    };
    const handleMouseUp = () => {
      mouseStatus = 'up';
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('resize', handleResize);
      Chart?.remove();
    };
  }, []);

  useEffect(() => {
    if (init) {
      Chart?.timeScale().fitContent();
      Chart?.subscribeCrosshairMove(param => {
        console.log(param, mouseStatus);
        const { hoveredObjectId } = param;
        if (mouseStatus === 'down' && hoveredObjectId) {
          const y = Number(Series.coordinateToPrice(param.point.y).toFixed(2));
          const line = linesMap.get(hoveredObjectId);
          line.applyOptions({ price: y });
        }
        if (hoveredObjectId) {
          document.body.style.cursor = 'ns-resize';
          Chart.applyOptions({
            handleScroll: {
              pressedMouseMove: false,
            },
          });
        } else {
          document.body.style.cursor = 'initial';
          Chart.applyOptions({
            handleScroll: {
              pressedMouseMove: true,
            },
          });
        }
      });
      Chart?.subscribeClick(param => {
        handleChartClick(
          param,
          Series,
          Chart,
          toolbarData,
          (freshToolbarData, replayData) => {
            if (freshToolbarData) {
              if (freshToolbarData) setToolBar(freshToolbarData);
              if (replayData) {
                const { time } = replayData;
                const index = ChartData.findIndex(itm => itm.time === time);
                if (index !== -1) {
                  const [oldData, nextData] = splitArray(ChartData, index);
                  Series.setData(oldData);
                  nextDataSeries = nextData;
                  Chart?.timeScale().fitContent();
                  // console.log(index, oldData, nextData);
                }
              }
            }
          },
        );
      });
    }
  }, [init]);

  useEffect(() => {
    toolbarData = toolbar;
    // if (toolbar?.replayActive && !toolbar.replay) {
    //   setToolBar({ replayActive: false, replay: false });
    //   Series.setData(ChartData);
    // }
    if (toolbar?.replay) {
      Chart.applyOptions({
        crosshair: {
          mode: 0,
          vertLine: {
            width: 3.2,
            color: 'blue',
            style: 0,
          },
          horzLine: {
            visible: false,
          },
        },
      });
    } else {
      Chart?.applyOptions({ crosshair: defaultCrossHairOptions });
    }
  }, [toolbar]);

  const addDataToChart = _d => {
    if (toolbar?.replayActive) {
      const { date } = nextDataSeries?.[0] || {};
      if (date) {
        const index = findFirstOccurrenceDateIndex(_d, moment(date));
        const [oldData, nextData] = splitArray(_d, index);
        Series.setData(oldData);
        nextDataSeries = nextData;
        Chart?.timeScale().fitContent();
        setData(_d);
      }
    } else {
      setData(_d);
      Series.setData(_d);
      Chart?.timeScale().fitContent();
    }
  };

  const getData = timeframe => {
    if (timeframe === ChartTimeFrames.MINUTE5) {
      const _d = convertTo5MinTimeframe(data);
      addDataToChart(_d);
      return;
    }
    upstoxClient
      .getHistoricalCandle('NSE_INDEX|Nifty Bank', timeframe, toDate, fromDate)
      .then(res => {
        const _d = formatCandles(res) || [];
        addDataToChart(_d);
      });
  };

  useEffect(() => {
    if (init) getData(toolbar?.timeframe);
  }, [toolbar.timeframe]);

  useEffect(() => {
    if (data) {
      ChartData = data;
      // Series.setData(data);
      setTimeout(() => {
        Chart?.timeScale().fitContent();
      }, 600);
    }
  }, [data]);

  const onDeleteLine = () => {
    const priceLine = linesMap.get(toolbar?.deleteLineId);
    linesMap.delete(toolbar?.deleteLineId);
    Series.removePriceLine(priceLine);
    setToolBar({ ...toolbar, deleteLineId: false });
  };

  const onNextBar = () => {
    const dataPoint = nextDataSeries.shift();
    console.log(dataPoint);
    Series.update(dataPoint);
  };

  const onReplyClose = () => {
    setToolBar({
      ...toolbar,
      replay: false,
      replayActive: false,
      isPlaying: false,
    });
    Series.setData(ChartData);
  };

  const onPlayReplay = () => {
    if (!replayInterval) {
      replayInterval = setInterval(() => {
        onNextBar();
      }, 100);
      setToolBar({ ...toolbar, isPlaying: true });
    } else {
      clearInterval(replayInterval);
      replayInterval = null;
      setToolBar({ ...toolbar, isPlaying: false });
    }
  };

  const deleteAllDrawing = () => {
    for (const [key, value] of linesMap) {
      const priceLine = value;
      Series.removePriceLine(priceLine);
      setToolBar({ ...toolbar, deleteLineId: false });
    }
  };

  return (
    <div>
      <Header
        toolbar={toolbar}
        setToolBar={setToolBar}
        deleteLine={onDeleteLine}
        deleteAllDrawing={deleteAllDrawing}
        onNextBar={onNextBar}
      />
      <div style={{ width: '100%', height: 300 }} ref={chartContainerRef} />
      <ReplayToolBar
        open={toolbar?.replayActive}
        isPlaying={toolbar?.isPlaying}
        playReplayNext={onNextBar}
        playReplay={onPlayReplay}
        selectReplayBar={() => setToolBar({ ...toolbar, replay: true })}
        replayClose={onReplyClose}
      />
    </div>
  );
};

export default ChartComponent;
