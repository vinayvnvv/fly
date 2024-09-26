import { Buffer } from 'buffer';
import { instrumentKeys } from '../config';
import { blobToArrayBuffer, decodeProfobuf, getUrl, initProtobuf } from './cmn';
import { upstoxClient } from '../config/upstox';
import { isPaperTrading } from '../common/utils';
import { BrokerApp } from '../main';

// MarketDataFeed component
class PortFolio {
  ws;
  type;
  onCallbacks = new Set();
  constructor(type) {
    initProtobuf();
    this.type = type ? type : 'position';
  }
  async connectWebSocket(callback) {
    this.callback = callback;
    if (isPaperTrading()) {
      BrokerApp.suscribeOrders(() => {
        if (this.callback) this.callback(BrokerApp.getPositions());
        if (this.onCallbacks.size > 0) {
          for (const call of this.onCallbacks) {
            if (call) call();
          }
        }
      });
      return;
    }
    try {
      const data = await upstoxClient.getPortfolioStreamForSocket(this.type);
      const wsUrl = data.data.authorized_redirect_uri;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        // setIsConnected(true);
        console.log('Connected PortFolio');
        // this.subscribe();
      };

      this.ws.onclose = () => {
        // setIsConnected(false);
        console.log('Disconnected');
      };

      this.ws.onmessage = async event => {
        // console.log(event);
        // const arrayBuffer = await blobToArrayBuffer(event.data);
        // let buffer = Buffer.from(arrayBuffer);
        // let response = decodeProfobuf(buffer);
        console.log('onmessage', event);
        if (this.callback) this.callback(event.data);
        if (this.onCallbacks.size > 0) {
          for (const call of this.onCallbacks) {
            if (call) call();
          }
        }
      };

      this.ws.onerror = error => {
        // setIsConnected(false);
        console.log('WebSocket error:', error);
      };

      //   return () => ws.close();
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }
  close() {
    this.ws.close();
  }
  on(callback) {
    this.onCallbacks.add(callback);
  }
  off(callback) {
    this.onCallbacks.delete(callback);
  }
}

export const PortFolioSocket = new PortFolio();
export const OrdersSocket = new PortFolio('order');
