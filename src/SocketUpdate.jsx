import { useEffect } from 'react';
import { MarketDataFeedSocket } from './socket/market';
import { useAtom, useSetAtom } from 'jotai';
import { stores, token } from './store';
import { upstoxClient } from './config/upstox';
import { PortFolioSocket } from './socket/portfolio';
import { formatFundsMarginData } from './common/utils';

const SocketUpdate = ({ onInit }) => {
  const [authToken] = useAtom(token);
  const [, setMarketFeed] = useAtom(stores.marketFeed);
  const setPositions = useSetAtom(stores.positions);
  const setFundsMargin = useSetAtom(stores.fundAndMargin);

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
    if (authToken) {
      MarketDataFeedSocket.connectWebSocket(data => {
        setMarketFeed(data);
        onInit();
      });
      PortFolioSocket.connectWebSocket(data => {
        console.log('PortFolioSocket', data);
        getPositions();
        getFundsMargin();
      });
    } else {
      onInit();
    }
  }, []);
  return <div />;
};
export default SocketUpdate;
