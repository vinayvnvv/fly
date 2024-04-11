import { Buffer } from 'buffer';
import { instrumentKeys } from '../config';
import { blobToArrayBuffer, decodeProfobuf, getUrl, initProtobuf } from './cmn';
import { upstoxClient } from '../config/upstox';

// MarketDataFeed component
class PortFolio {
  ws;
  constructor() {
    initProtobuf();
  }
  async connectWebSocket(callback) {
    this.callback = callback;
    try {
      const data = await upstoxClient.getPortfolioStreamForSocket('position');
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
