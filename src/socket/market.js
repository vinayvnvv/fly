import { Buffer } from 'buffer';
import { instrumentKeys } from '../config';
import { blobToArrayBuffer, decodeProfobuf, getUrl, initProtobuf } from './cmn';

// MarketDataFeed component
class MarketDataFeed {
  ws;
  keys = new Set();
  keysBindingsLength = new Map();
  guid = 'guid';
  constantKeys = new Set([
    instrumentKeys.BANKNIFTY,
    instrumentKeys.FINNIFTY,
    instrumentKeys.NIFTY,
  ]);
  callback;
  onCallbacks = new Set();
  constructor() {
    initProtobuf();
    this.keys = new Set();
  }
  async connectWebSocket(callback) {
    this.callback = callback;
    try {
      const wsUrl = await getUrl();
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        // setIsConnected(true);
        console.log('Connected');
        this.subscribe();
      };

      this.ws.onclose = () => {
        // setIsConnected(false);
        console.log('Disconnected');
      };

      this.ws.onmessage = async event => {
        // console.log(this.keys);
        const arrayBuffer = await blobToArrayBuffer(event.data);
        let buffer = Buffer.from(arrayBuffer);
        let response = decodeProfobuf(buffer);
        // console.log(
        //   'socket subs -> Actual:',
        //   this.keys.size,
        //   'Real: ',
        //   Object.keys(response.feeds).length,
        // );
        if (this.callback) this.callback(response?.feeds);
        if (this.onCallbacks.size > 0) {
          for (const call of this.onCallbacks) {
            if (call) call(response?.feeds);
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
  createSuscribeData() {
    const keys = this.keys.union(this.constantKeys);
    const data = {
      guid: this.guid,
      method: 'sub',
      data: {
        mode: 'ltpc',
        instrumentKeys: keys.keys().toArray(),
      },
    };
    return Buffer.from(JSON.stringify(data));
  }
  createUnSuscribeData(key) {
    const data = {
      guid: this.guid,
      method: 'unsub',
      data: {
        mode: 'ltpc',
        instrumentKeys: [key],
      },
    };
    return Buffer.from(JSON.stringify(data));
  }
  close() {
    this.ws.close();
  }
  unSubscribe(key) {
    const count = this.keysBindingsLength.get(key);
    this.keysBindingsLength.set(
      key,
      (this.keysBindingsLength.get(key) || 0) - 1,
    );
    if (count === 1) {
      this.keys.delete(key);
      const data = this.createUnSuscribeData(key);
      this?.ws?.send(data);
    }
  }
  subscribe(key) {
    if (typeof key === 'string') {
      key = [key];
    }
    if (Array.isArray(key)) {
      for (let i = 0; i < key.length; i++) {
        this.keysBindingsLength.set(
          key[i],
          (this.keysBindingsLength.get(key[i]) || 0) + 1,
        );
        this.keys.add(key[i]);
      }
    }
    const data = this.createSuscribeData();
    this?.ws?.send(data);
  }
  on(callback) {
    this.onCallbacks.add(callback);
  }
  off(callback) {
    this.onCallbacks.delete(callback);
  }
}

export const MarketDataFeedSocket = new MarketDataFeed();
