import { DEFAULT_PAGE_SIZES, META, PageSize } from '../../../src/tags/page-size/gb-page-size';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-page-size', PageSize, ({
  tag, flux, spy, stub,
  itShouldAlias, itShouldHaveMeta
}) => {
  itShouldHaveMeta(PageSize, META);

  describe('init()', () => {
    itShouldAlias('selectable');
  });

  describe('setDefaults()', () => {
    it('should set items from global config', () => {
      const pageSizes = [1, 2, 3, 4];
      tag().config = <any>{ pageSizes };

      tag().setDefaults();

      expect(tag().items).to.eq(pageSizes);
    });

    it('should fallback to default items', () => {
      tag().setDefaults();

      expect(tag().items).to.eq(DEFAULT_PAGE_SIZES);
    });
  });

  describe('onSelect()', () => {
    it('should resize and keep offset', (done) => {
      flux().resize = (pageSize, reset): any => {
        expect(pageSize).to.eq(40);
        expect(reset).to.be.undefined;
        done();
      };
      flux().query.skip(43);

      tag().onSelect(40);
    });

    it('should resize and reset offset', (done) => {
      flux().resize = (pageSize, reset): any => {
        expect(pageSize).to.eq(20);
        expect(reset).to.be.true;
        done();
      };
      flux().query.skip(43);
      tag().resetOffset = true;

      tag().onSelect(20);
    });

    it('should emit tracking event', (done) => {
      const search = spy();
      const resize = stub(flux(), 'resize').resolves();
      tag().services = <any>{ tracker: { search } };
      flux().query.skip(43);

      tag().onSelect(40)
        .then(() => {
          expect(search).to.be.called;
          expect(resize).to.be.called;
          done();
        });
    });

    it('should check for tracker service', (done) => {
      stub(flux(), 'resize').resolves();
      tag().services = <any>{};

      tag().onSelect(40)
        .then(() => done());
    });
  });
});
