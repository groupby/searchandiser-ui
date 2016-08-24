import { FluxCapacitor, Events } from 'groupby-api';
import { fluxTag } from '../../utils/tags';
import { Snippet } from '../../../src/tags/snippet/gb-snippet';
import { expect } from 'chai';

describe('gb-snippet logic', () => {
  let tag: Snippet;

  beforeEach(() => ({ tag } = fluxTag(new Snippet())));

  it('should have default values', () => {
    tag.init();

    expect(tag.isRaw).to.be.false;
  });

  it('should accept override from opts', () => {
    Object.assign(tag.opts, { raw: true });
    tag.init();

    expect(tag.isRaw).to.be.true;
  });

  it('should listen for mount event', () => {
    tag.on = (event: string, cb) => {
      expect(event).to.eq('mount');
      expect(cb).to.eq(tag.loadFile);
    };
    tag.init();
  });
});
