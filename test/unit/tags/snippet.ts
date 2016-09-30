import { DEFAULT_CONFIG, Snippet } from '../../../src/tags/snippet/gb-snippet';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-snippet', Snippet, ({ tag }) => {
  it('should configure itself with defaults', (done) => {
    tag().configure = (defaults) => {
      expect(defaults).to.eq(DEFAULT_CONFIG);
      done();
    };

    tag().init();
  });

  it('should listen for mount event', () => {
    tag().on = (event: string, cb) => {
      expect(event).to.eq('mount');
      expect(cb).to.eq(tag().loadFile);
    };
    tag().init();
  });
});
