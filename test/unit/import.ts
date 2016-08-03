import { FluxCapacitor, Events } from 'groupby-api';
import { Import } from '../../src/tags/import/gb-import';
import { expect } from 'chai';

describe('gb-import logic', () => {
  let importTag: Import;
  let flux: FluxCapacitor;
  beforeEach(() => {
    importTag = new Import();
    flux = new FluxCapacitor('');
    importTag.opts = { flux };
    importTag.on = () => null;
  });

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
