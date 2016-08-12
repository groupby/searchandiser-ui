import { FluxCapacitor, Events, Results } from 'groupby-api';
import { fluxTag } from '../utils/tags';
import { PageSize } from '../../src/tags/page-size/gb-page-size';
import { expect } from 'chai';

describe('gb-page-size logic', () => {
  let tag: PageSize,
    flux: FluxCapacitor;

  beforeEach(() => ({ tag, flux } = fluxTag(new PageSize())));

  // it('should have default values', () => {
  //   tag.init();
  //
  //   expect(tag.passthrough).to.be.ok;
  //   expect(tag.passthrough.hover).to.not.be.ok;
  //   expect(tag.passthrough.update).to.eq(tag.resize);
  //   expect(tag.passthrough.options).to.eql([10, 25, 50, 100]);
  //   expect(tag.passthrough.default).to.be.true;
  // });
  //
  // it('should allow override from opts', () => {
  //   const pageSizes = [12, 24, 48],
  //     onHover = false;
  //
  //   tag.config.pageSizes = pageSizes;
  //   tag.opts.onHover = onHover;
  //   tag.init();
  //
  //   expect(tag.parentOpts).to.have.all.keys('onHover');
  //   expect(tag.passthrough).to.be.ok;
  //   expect(tag.passthrough.options).to.eq(pageSizes);
  //   expect(tag.passthrough.hover).to.be.false;
  // });
  //
  // it('should resize', () => {
  //   const newPageSize = 40;
  //
  //   flux.resize = (value, newOffset): any => {
  //     expect(value).to.eq(newPageSize);
  //     expect(newOffset).to.not.be.ok;
  //   };
  //
  //   tag.init();
  //
  //   tag.resize(newPageSize);
  // });
  //
  // it('should resize and reset offset', () => {
  //   flux.resize = (value, newOffset): any => expect(newOffset).to.eq(0);
  //
  //   Object.assign(tag.opts, { resetOffset: true });
  //   tag.init();
  //
  //   tag.resize(20);
  // });
});
