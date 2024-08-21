import { useEffect } from 'react';
import { MarketDataFeedSocket } from './socket/market';
import { useAtom, useSetAtom } from 'jotai';
import { stores, token } from './store';
import { upstoxClient } from './config/upstox';
import { OrdersSocket, PortFolioSocket } from './socket/portfolio';
import {
  displaySuccessNotification,
  formatFundsMarginData,
} from './common/utils';
import { useSnackbar } from 'notistack';

const SocketUpdate = ({ onInit }) => {
  const [authToken] = useAtom(token);
  const [feeds, setMarketFeed] = useAtom(stores.marketFeed);
  const setPositions = useSetAtom(stores.positions);
  const setFundsMargin = useSetAtom(stores.fundAndMargin);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const getPositions = () => {
    upstoxClient.getPositions().then(res => {
      setPositions(res);
    });
  };
  const getFundsMargin = () => {
    upstoxClient.getFundMargin().then(res => {
      setFundsMargin(formatFundsMarginData(res?.data));
    });
  };
  useEffect(() => {
    const sellAudioRef = document.getElementById('sell-audio');
    if (authToken) {
      MarketDataFeedSocket.connectWebSocket(data => {
        setMarketFeed({ ...feeds, ...data });
        onInit();
      });
      PortFolioSocket.connectWebSocket(data => {
        console.log('PortFolioSocket', data);
        getPositions();
        getFundsMargin();
      });
      OrdersSocket.connectWebSocket(_data => {
        const data = JSON.parse(_data);
        console.log('OrdersSocket', data);
        const { status, instrument_key, trading_symbol } = data;
        if (instrument_key && status && status === 'complete') {
          closeSnackbar();
          setTimeout(() => {
            displaySuccessNotification(
              enqueueSnackbar,
              `${trading_symbol} completed.`,
            );
          }, 300);
          if (sellAudioRef) sellAudioRef.play();
        }
      });
    } else {
      onInit();
    }
  }, []);
  return <div />;
};
export default SocketUpdate;
