/// <reference path="../typings/index.d.ts" />
/// <reference path="../custom_typings/debounce.d.ts" />
/// <reference path="../custom_typings/gb-tracker-client.d.ts" />

import { initSearchandiser, Searchandiser } from './searchandiser';
import './tags/index';

if (!window['searchandiser']) {
  window['searchandiser'] = initSearchandiser();
}

export { Searchandiser };
