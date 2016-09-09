/// <reference path="../typings/index.d.ts" />
/// <reference path="../custom_typings/debounce.d.ts" />
/// <reference path="../custom_typings/oget.d.ts" />

require('array-includes').shim();
import { initSearchandiser } from './searchandiser';
import './tags/index';

export = initSearchandiser();
