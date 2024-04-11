import protobuf from 'protobufjs';
import { upstoxClient } from '../config/upstox';
// Initialize Protobuf root
let protobufRoot = null;
export const initProtobuf = async () => {
  protobufRoot = await protobuf.load('./marketDataFeed.proto');
  console.log('Protobuf part initialization complete');
};

// Function to get WebSocket URL
export const getUrl = async () => {
  const res = await upstoxClient.getMarketDataFeedForSocket();
  return res.data.authorizedRedirectUri;
};

// Helper functions for handling Blob and ArrayBuffer
export const blobToArrayBuffer = async blob => {
  if ('arrayBuffer' in blob) return await blob.arrayBuffer();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject();
    reader.readAsArrayBuffer(blob);
  });
};

// Decode Protobuf messages
export const decodeProfobuf = buffer => {
  if (!protobufRoot) {
    console.warn('Protobuf part not initialized yet!');
    return null;
  }
  const FeedResponse = protobufRoot.lookupType(
    'com.upstox.marketdatafeeder.rpc.proto.FeedResponse',
  );
  return FeedResponse.decode(buffer);
};
