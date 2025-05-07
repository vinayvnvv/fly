import { useEffect, useState } from 'react';
import { fyers } from '../../main';
import { stores } from '../../store';
import { useAtom } from 'jotai';
import PostionsBar from '../../components/PostionsBar';

export const convertToUpstoxPositions = (positions, symbols) => {
  return positions.map(itm => {
    let key = symbols.find(symbol => symbol.fyers_symbol === itm.symbol);
    console.log(key);
    return {
      ...itm,
      day_buy_value: itm.buyVal,
      day_sell_value: itm.sellVal,
      quantity: itm.qty,
      pnl: itm.pl,
      last_price: itm.ltp,
      tradingsymbol: itm.symbol,
      trading_symbol: itm.symbol,
      average_price: itm.buyAvg,
      instrument_key: key?.instrument_key,
      instrument_token: key?.instrument_key,
    };
  });
};

export const FyersPositions = ({ funds, positions, onTransaction }) => {
  return (
    <div>
      {positions && (
        <PostionsBar
          positionsData={{ data: positions }}
          isFyers
          fyers={{
            margin: funds?.equityAmount,
          }}
          onFyerTransaction={onTransaction}
        />
      )}
    </div>
  );
};
