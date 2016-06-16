/// <reference path="../typings/index.d.ts" />

import { InitSearchandiser } from './searchandiser';
import './tags/index';

if (!window['searchandiser']) {
  window['searchandiser'] = InitSearchandiser();
}
