import { FluxCapacitor, Events, Results } from 'groupby-api';
import { PageSize } from '../../src/tags/page-size/gb-page-size';
import { expect } from 'chai';

describe('gb-page-size logic', () => {
  let pageSize: PageSize;
  let flux: FluxCapacitor;
  beforeEach(() => {
    pageSize = new PageSize();
    flux = new FluxCapacitor('');
    pageSize.opts = { flux, config: {} };
  });

  it('should have default values', () => {
    pageSize.init();
    expect(pageSize.parentOpts).to.have.all.keys('flux', 'config');
    expect(pageSize.passthrough).to.be.ok;
    expect(pageSize.passthrough.hover).to.not.be.ok;
    expect(pageSize.passthrough.update).to.eq(pageSize.resize);
    expect(pageSize.passthrough.options).to.eql([10, 25, 50, 100]);
    expect(pageSize.passthrough.default).to.be.true;
  });

  it('should allow override from opts', () => {
    const pageSizes = [12, 24, 48];
    const onHover = false;

    Object.assign(pageSize.opts, { config: { pageSizes }, onHover });
    pageSize.init();

    expect(pageSize.parentOpts).to.have.all.keys('flux', 'config', 'onHover');
    expect(pageSize.passthrough).to.be.ok;
    expect(pageSize.passthrough.options).to.eq(pageSizes);
    expect(pageSize.passthrough.hover).to.be.false;
  });

  it('should resize', () => {
    const newPageSize = 40;

    flux.resize = (value, newOffset): any => {
      expect(value).to.eq(newPageSize);
      expect(newOffset).to.not.be.ok;
    };

    pageSize.init();

    pageSize.resize(newPageSize);
  });

  it('should resize and reset offset', () => {
    flux.resize = (value, newOffset): any => expect(newOffset).to.eq(0);

    Object.assign(pageSize.opts, { resetOffset: true });
    pageSize.init();

    pageSize.resize(20);
  });
});
