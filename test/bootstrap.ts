/// <reference path="../typings/index.d.ts" />

require('es6-promise').polyfill();
import riot = require('riot');

window['riot'] = riot;
riot.mixin({
  init() {
    this.mixin('test');
  }
});
