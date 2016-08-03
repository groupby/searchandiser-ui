import { FluxCapacitor, Events } from 'groupby-api';
import { Snippet } from '../../src/tags/snippet/gb-snippet';
import { expect } from 'chai';

describe('gb-snippet logic', () => {
  let importTag: Snippet;
  beforeEach(() => importTag = Object.assign(new Snippet(), { opts: {}, on: () => null }));

  it('should have default values', () => {
    importTag.init();

    expect(importTag.isRaw).to.be.false;
  });

  it('should accept override from opts', () => {
    Object.assign(importTag.opts, { raw: true });
    importTag.init();

    expect(importTag.isRaw).to.be.true;
  });

  it('should listen for mount event', () => {
    importTag.on = (event: string, cb) => {
      expect(event).to.eq('mount');
      expect(cb).to.eq(importTag.loadFile);
    };
    importTag.init();
  });
});
