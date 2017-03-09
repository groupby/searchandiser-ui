import './polyfills';
import { initSearchandiser, Searchandiser, SearchandiserConfig } from './searchandiser';
import './tags/index';
import * as utils from './utils/common';
import {
  BrowserBridge,
  CloudBridge,
  FluxCapacitor,
  Query
} from 'groupby-api';
import { Sayt } from 'sayt';

declare var VERSION;

const searchandiser = initSearchandiser();
searchandiser['version'] = VERSION;

export {
  searchandiser,
  utils,
  BrowserBridge,
  CloudBridge,
  FluxCapacitor,
  Query,
  Sayt,
  Searchandiser,
  SearchandiserConfig
}
