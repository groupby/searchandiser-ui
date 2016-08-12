import { FluxCapacitor, Events, Results } from 'groupby-api';
import { fluxTag } from '../utils/tags';
import { PageSize } from '../../src/tags/page-size/gb-page-size';
import { expect } from 'chai';

describe('gb-page-size logic', () => {
  let tag: PageSize,
    flux: FluxCapacitor;

  beforeEach(() => ({ tag, flux } = fluxTag(new PageSize())));

  it('should have default values', () => {
    tag.init();

    expect(tag.options).to.eql([10, 25, 50, 100]);
  });

  it('should allow override from opts', () => {
    const pageSizes = [12, 24, 48];

    tag.config.pageSizes = pageSizes;
    tag.init();

    expect(tag.options).to.eq(pageSizes);
  });

  it('should resize', () => {
    const newPageSize = 40;

    flux.resize = (value, newOffset): any => {
      expect(value).to.eq(newPageSize);
      expect(newOffset).to.not.be.ok;
    };

    tag.init();

    tag.onselect(newPageSize);
  });

  it('should resize and reset offset', () => {
    flux.resize = (value, newOffset): any => expect(newOffset).to.eq(0);

    Object.assign(tag.opts, { resetOffset: true });
    tag.init();

    tag.onselect(20);
  });
});
