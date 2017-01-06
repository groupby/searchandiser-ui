import { DidYouMean } from '../../../src/tags/did-you-mean/gb-did-you-mean';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-did-you-mean', DidYouMean, ({
  flux, tag, spy, stub,
  expectSubscriptions
}) => {

  describe('init()', () => {
    it('should listen for events', () => {
      expectSubscriptions(() => tag().init(), {
        [Events.RESULTS]: tag().updateDidYouMean
      });
    });
  });

  describe('onSelect()', () => {
    it('should call flux.rewrite()', (done) => {
      const newQuery = 'red sneakers';
      flux().rewrite = (query): any => {
        expect(query).to.eq(newQuery);
        done();
      };

      tag().onSelect(<any>{ target: { text: newQuery } });
    });

    it('should emit tracker event', (done) => {
      const didYouMean = spy();
      const rewrite = stub(flux(), 'rewrite').resolves();
      tag().services = <any>{ tracker: { didYouMean } };

      tag().onSelect(<any>{ target: {} })
        .then(() => {
          expect(didYouMean).to.have.been.called;
          expect(rewrite).to.have.been.called;
          done();
        });
    });

    it('should check for tracker service', (done) => {
      stub(flux(), 'rewrite').resolves();
      tag().services = <any>{};

      tag().onSelect(<any>{ target: {} })
        .then(() => done());
    });
  });

  describe('updateDidYouMean()', () => {
    it('should call update() with didYouMean', () => {
      const items = ['a', 'b', 'c'];
      const update = tag().update = spy();

      tag().updateDidYouMean(<any>{ didYouMean: items });

      expect(update).to.have.been.calledWith({ items });
    });
  });
});
