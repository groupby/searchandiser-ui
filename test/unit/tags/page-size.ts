import { PageSize } from '../../../src/tags/page-size/gb-page-size';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-page-size', PageSize, ({
  tag, flux, spy, stub,
  itShouldAlias
}) => {

  describe('init()', () => {
    itShouldAlias('selectable');

    it('should have default values', () => {
      tag().init();

      expect(tag().resetOffset).to.be.false;
      expect(tag().options).to.eql([10, 25, 50, 100]);
    });

    it('should set properties from opts', () => {
      tag().opts = { resetOffset: true };

      tag().init();

      expect(tag().resetOffset).to.be.true;
    });

    it('should read global pageSizes', () => {
      const pageSizes = [12, 24, 48];
      tag().config = { pageSizes };

      tag().init();

      expect(tag().options).to.eq(pageSizes);
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
          expect(search).to.have.been.called;
          expect(resize).to.have.been.called;
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
