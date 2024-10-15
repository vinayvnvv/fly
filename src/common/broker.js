import moment from 'moment';
class Broker {
  positions = {};
  storageKey = `broker_positions_${moment().format('YYYY-MM-DD')}`;
  storageKeyOrders = `broker_orders_${moment().format('YYYY-MM-DD')}`;
  today = moment().format('YYYY-MM-DD');
  initialPosition = {
    quantity: 0,
    day_sell_value: 0,
    day_buy_value: 0,
  };
  callbacks = new Set();
  orders = [];

  constructor() {
    this.syncStorage();
  }

  suscribeOrders(callback) {
    this.callbacks.add(callback);
  }
  unSuscribeOrders(callback) {
    this.callbacks.delete(callback);
  }

  callSubscribers() {
    if (this.callbacks.size > 0) {
      for (const call of this.callbacks) {
        if (call) call(this.getPositions());
      }
    }
  }

  syncStorage(positions, order) {
    if (positions) {
      localStorage.setItem(this.storageKey, JSON.stringify(positions));
    } else {
      let _data = localStorage.getItem(this.storageKey);
      if (_data) {
        this.positions = JSON.parse(_data);
      }
    }
    if (order) {
      let _data = localStorage.getItem(this.storageKeyOrders) || '[]';
      if (_data) {
        const _orders = JSON.parse(_data);
        _orders.push({
          ...order,
          filled_quantity: order.quantity,
          order_type: 'MARKET',
          average_price: order.at,
          order_timestamp: moment().toISOString(),
        });
        this.orders = _orders;
        localStorage.setItem(this.storageKeyOrders, JSON.stringify(_orders));
      }
    } else {
      let _data = localStorage.getItem(this.storageKeyOrders);
      if (_data) {
        this.orders = JSON.parse(_data);
      }
    }
  }

  getPositions() {
    return Object.keys(this.positions).map(key => {
      const { quantity, day_sell_value, day_buy_value } = this.positions[key];
      const pnl = quantity === 0 ? day_sell_value - day_buy_value : 0;
      return {
        ...this.positions[key],
        pnl,
        instrument_token: key,
      };
    });
  }

  getOrders() {
    return this.orders;
  }

  onOrderUpdate(orderData) {
    this.syncStorage(this.positions, orderData);
    this.callSubscribers();
  }

  buy(instrument_token, quantity, price) {
    let position = this.positions[instrument_token] || this.initialPosition;
    let _quantity = position['quantity'] + quantity;
    let _day_buy_value = position['day_buy_value'] + quantity * price;
    const positionData = {
      ...position,
      quantity: _quantity,
      day_buy_value: _day_buy_value,
      instrument_token: instrument_token,
      at: price,
      transaction_type: 'BUY',
    };
    this.positions[instrument_token] = positionData;
    this.onOrderUpdate({ ...positionData, quantity });
  }
  sell(instrument_token, quantity, price) {
    let position = this.positions[instrument_token];
    if (!position) return;
    let _quantity = position['quantity'] - quantity;
    let _day_sell_value = position['day_sell_value'] + quantity * price;
    const positionData = {
      ...position,
      quantity: _quantity,
      day_sell_value: _day_sell_value,
      instrument_token: instrument_token,
      at: price,
      transaction_type: 'SELL',
    };
    this.positions[instrument_token] = positionData;
    this.onOrderUpdate({ ...positionData, quantity });
  }
  order(data) {
    const { instrument_token, quantity, price, transaction_type } = data;
    if (transaction_type === 'SELL') {
      this.sell(instrument_token, quantity, price);
    } else {
      this.buy(instrument_token, quantity, price);
    }
  }
}

export default Broker;
