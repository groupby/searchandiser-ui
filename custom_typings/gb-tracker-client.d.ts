declare interface TrackerClient {
  enableWarnings(): void;
  disableWarnings(): void;
  sendAddToCartEvent(data: any): void;
  sendOrderEvent(data: any): void;
  sendSearchEvent(data: any): void;
  sendViewProductEvent(data: any): void;
  setVisitor(visitorId: any, sessionId: any): void;
  new (customerId: any, area: any);
}

declare const GbTracker: TrackerClient;

declare module 'gb-tracker-client' {

  export = GbTracker;
}
