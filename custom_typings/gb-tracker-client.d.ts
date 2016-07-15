declare interface TrackerClient {
  sendAddToBasketEvent: (data: any) => void;
  sendOrderEvent: (data: any) => void;
  sendSearchEvent: (data: any) => void;
  sendViewProductEvent: (data: any) => void;
  new(customerId: any, area: any)
}

declare var tracker: TrackerClient;

declare module 'gb-tracker-client' {
  export = tracker;
}
