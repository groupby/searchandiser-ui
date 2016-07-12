/// <reference path="../typings/index.d.ts" />

import { initSearchandiser, Searchandiser } from './searchandiser';
import './tags/index';

if (!window['searchandiser']) {
  window['searchandiser'] = initSearchandiser();
}

export { Searchandiser };
