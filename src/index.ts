/// <reference path="../typings/index.d.ts" />

import { initSearchandiser } from './searchandiser';
import './tags/index';

if (!window['searchandiser']) {
  window['searchandiser'] = initSearchandiser();
}
