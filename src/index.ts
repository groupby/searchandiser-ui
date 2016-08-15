/// <reference path="../typings/index.d.ts" />
/// <reference path="../custom_typings/debounce.d.ts" />
/// <reference path="../custom_typings/oget.d.ts" />

import riot = require('riot');
import { initSearchandiser, Searchandiser } from './searchandiser';
import './tags/index';

if (!window['riot']) {
  window['riot'] = riot;
}

if (!window['searchandiser']) {
  window['searchandiser'] = initSearchandiser();
}

export { Searchandiser };
