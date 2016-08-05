/// <reference path="../typings/index.d.ts" />

require('es6-promise').polyfill();
import riot = require('riot');
import { FluxCapacitor } from 'groupby-api';
window['riot'] = riot;
riot.mixin({
  init: function() {
    this.mixin('test');
  }
});
