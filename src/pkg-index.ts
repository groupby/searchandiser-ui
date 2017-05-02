import {
  BrowserBridge,
  CloudBridge,
  FluxCapacitor,
  Query
} from 'groupby-api';
import { Sayt } from 'sayt';
import './polyfills';
import { initStoreFront, StoreFront, StoreFrontConfig } from './searchandiser';
import './tags/index';
import * as utils from './utils/common';

declare var VERSION;

const searchandiser = initStoreFront();
searchandiser['version'] = VERSION;

export {
searchandiser,
utils,
BrowserBridge,
CloudBridge,
FluxCapacitor,
Query,
Sayt,
StoreFront,
StoreFrontConfig
};
