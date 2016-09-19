import '../src/polyfills';
import * as riot from 'riot';

window['riot'] = riot;
riot.mixin({
  init() {
    this.mixin('test');
  }
});
