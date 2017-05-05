import {
  BrowserBridge,
  CloudBridge,
  FluxCapacitor,
  Query
} from 'groupby-api';
import { Sayt } from 'sayt';
import './polyfills';
import { initStoreFront, StoreFront } from './searchandiser';
import './tags/index';
import * as utils from './utils/common';
import StoreFrontConfig = StoreFront.Config;

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
