import { useAtom, useSetAtom } from 'jotai';
import { stores, token } from './store';
import { upstoxClient } from './config/upstox';
import {
  filterSymbols,
  filterSymbolsObject,
  formatFundsMarginData,
} from './common/utils';
import { memo, useEffect } from 'react';

const InitApp = ({ onInit }) => {
  const [authToken] = useAtom(token);
  const [symbols, setSymbols] = useAtom(stores.symbols);
  const [_, setFilteredSymbols] = useAtom(stores.filteredSymbols);
  const [__, setSymbolsObjects] = useAtom(stores.symbolsObjects);
  const setPositions = useSetAtom(stores.positions);
  const setFundsMargin = useSetAtom(stores.fundAndMargin);
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
    getPositions();
    if (!symbols) {
      await upstoxClient.getSymbols().then(res => {
        setSymbols(res);
        setFilteredSymbols(filterSymbols(res));
        setSymbolsObjects(filterSymbolsObject(res));
        setTimeout(() => {
          onInit();
        }, 100);
      });
    } else {
      onInit();
    }
  };
  return <div />;
};
export default memo(InitApp);
