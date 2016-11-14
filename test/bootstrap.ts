import '../src/polyfills';
import * as chai from 'chai';
import * as riot from 'riot';
import * as sinonChai from 'sinon-chai';

chai.use(sinonChai);

window['riot'] = riot;
riot.mixin({
  init() {
    this.mixin('test');
  }
});
