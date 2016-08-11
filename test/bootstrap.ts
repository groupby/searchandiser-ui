/// <reference path="../typings/index.d.ts" />

require('es6-promise').polyfill();
import riot = require('riot');
import { FluxCapacitor } from 'groupby-api';
import { setParents, setScope } from '../src/tags/tag';

window['riot'] = riot;
riot.mixin({
  init: function() {
    setParents(this);
    setScope(this)
    this.mixin('test');
  }
});
