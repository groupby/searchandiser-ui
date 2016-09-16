require('string.prototype.startswith');
require('string.prototype.repeat');
require('array.of');
require('array.from').shim();
require('array-includes').shim();
import { initSearchandiser } from './searchandiser';
import './tags/index';

export = initSearchandiser();
