import { FluxCapacitor, Query, BrowserBridge, Results, Events } from 'groupby-api';
import EventEmitter = require('eventemitter3');

export function mockFlux(overrides: any = {}): FluxCapacitor {
  return Object.assign({
    query: <Query>{},
    bridge: <BrowserBridge>{},
    results: <Results>{},
    page: {
      reset: () => null,
      next: () => null,
      prev: () => null,
      last: () => null
    },
    search: () => null,
    rewrite: () => null,
    reset: () => null,
    resize: () => null,
    refine: () => null,
    unrefine: () => null,
    listeners: () => null,
    emit: () => null,
    on: () => null,
    off: () => null,
    once: () => null,
    setMaxListeners: () => null,
    addListener: () => null,
    removeListener: () => null,
    removeAllListeners: () => null
  }, Events, overrides);
}
