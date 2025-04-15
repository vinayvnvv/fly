import { useAtom, useSetAtom } from 'jotai';
import { stores, token } from './store';
import { upstoxClient } from './config/upstox';
import {
  filterSymbols,
  filterSymbolsObject,
  formatFundsMarginData,
} from './common/utils';
import { memo, useEffect } from 'react';
import { Controller } from './common/controller';
import { instruments } from './lib/indexDB';

const InitApp = ({ onInit }) => {
  const [authToken] = useAtom(token);
  const [symbols, setSymbols] = useAtom(stores.symbols);
  const [_, setFilteredSymbols] = useAtom(stores.filteredSymbols);
  const [__, setSymbolsObjects] = useAtom(stores.symbolsObjects);
  const setSymbolQuantityInfo = useSetAtom(stores.symbolQuantityInfo);
  const setPositions = useSetAtom(stores.positions);
  const setFundsMargin = useSetAtom(stores.fundAndMargin);
  const setQuantitySizeInit = useSetAtom(stores.quantitySizeInit);
  const setBaskets = useSetAtom(stores.baskets);
  useEffect(() => {
    console.log('symbols', symbols, _);
    initApp();
  }, []);

  const getPositions = () => {
    upstoxClient.getPositions().then(res => {
      setPositions(res);
    });
  };

  const initApp = async () => {
    if (!authToken) {
      onInit();
      return;
    }
    upstoxClient.getFundMargin().then(res => {
      setFundsMargin(formatFundsMarginData(res?.data));
    });
    upstoxClient.getOrderBook().then(res => {
      Controller.setOrders(res);
    });
    getPositions();
    if (!symbols) {
      await upstoxClient.getSymbols().then(res => {
        setSymbols(res);
        setBaskets([]);
        const { data, symbolQuantityInfo, quantitySizeInit } =
          filterSymbols(res);
        setFilteredSymbols(data);
        setSymbolQuantityInfo(symbolQuantityInfo);
        // setQuantitySizeInit(quantitySizeInit);
        setSymbolsObjects(filterSymbolsObject(res));
        setTimeout(() => {
          onInit();
        }, 100);
      });
    } else {
      onInit();
    }
    if (!instruments.isDBLoaded()) {
      instruments.loadData();
    }
  };
  return <div />;
};
export default memo(InitApp);
