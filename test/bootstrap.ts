require('string.prototype.startswith');
require('string.prototype.repeat');
require('array.of');
require('array.from').shim();
require('array-includes').shim();
import * as riot from 'riot';

window['riot'] = riot;
riot.mixin({
  init() {
    this.mixin('test');
  }
});
