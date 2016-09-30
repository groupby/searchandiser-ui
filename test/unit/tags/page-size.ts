import { PageSize } from '../../../src/tags/page-size/gb-page-size';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-page-size', PageSize, ({ tag, flux }) => {
  it('should configure itself', (done) => {
    tag().configure = (defaults) => {
      expect(defaults).to.be.undefined;
      done();
    };

    tag().init();
  });

  it('should have default values', () => {
    tag().init();

    expect(tag()._config).to.eql({});
    expect(tag().options).to.eql([10, 25, 50, 100]);
  });

  it('should read global pageSizes', () => {
    const pageSizes = [12, 24, 48];

    tag().config.pageSizes = pageSizes;
    tag().init();

    expect(tag().options).to.eq(pageSizes);
  });

  it('should resize and keep offset', () => {
    flux().query.skip(43);

    flux().search = (): any => {
      expect(flux().query.raw.skip).to.eq(40);
      expect(flux().query.raw.pageSize).to.eq(40);
    };

    tag().init();

    tag().onselect(40);
  });

  it('should resize and reset offset', () => {
    flux().query.skip(43);

    flux().search = (): any => {
      expect(flux().query.raw.skip).to.eq(0);
      expect(flux().query.raw.pageSize).to.eq(20);
    };

    tag().opts = { resetOffset: true };
    tag().init();

    tag().onselect(20);
  });

});
