import { Snippet } from '../../../src/tags/snippet/gb-snippet';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-snippet', Snippet, ({ tag }) => {
  it('should have default values', () => {
    tag().init();

    expect(tag().isRaw).to.be.false;
  });

  it('should accept override from opts', () => {
    Object.assign(tag().opts, { raw: true });
    tag().init();

    expect(tag().isRaw).to.be.true;
  });

  it('should listen for mount event', () => {
    tag().on = (event: string, cb) => {
      expect(event).to.eq('mount');
      expect(cb).to.eq(tag().loadFile);
    };
    tag().init();
  });
});
