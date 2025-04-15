import { useEffect, useState } from 'react';
import { fyers } from '../../main';
import Orders from '../orders/Orders';

const statusMap = {
  1: 'cancelled',
  2: 'complete',
  3: 'cancelled',
  4: 'rejected',
  5: 'rejected',
};

const orderTypeMap = {
  1: 'LIMIT',
  2: 'MARKET',
  3: 'SL-M',
  4: 'SL',
};

const convertFyersDataToUpstoxData = data => {
  return data.map(itm => ({
    ...itm,
    transaction_type: itm.side === 1 ? 'BUY' : 'SELL',
    status: statusMap[itm.status],
    order_timestamp: itm.orderDateTime,
    instrument_token: '',
    trading_symbol: itm.symbol,
    filled_quantity: itm.filledQty,
    quantity: itm.qty,
    order_type: orderTypeMap[itm.type],
    average_price: itm.tradedPrice,
  }));
};

export const FyersOrders = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fyers.get_orders().then(res => {
      const orders = convertFyersDataToUpstoxData(res?.orderBook);
      console.log('FyersOrders', orders);
      setOrders(orders);
    });
  }, []);
  return (
    <div>
      {orders && Array.isArray(orders) && orders.length > 0 && (
        <Orders initialOrders={orders} fromFyers />
      )}
    </div>
  );
};
