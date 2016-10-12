import { DidYouMean } from '../../../src/tags/did-you-mean/gb-did-you-mean';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-did-you-mean', DidYouMean, ({
  flux, tag, sandbox,
  expectSubscriptions
}) => {

  describe('init()', () => {
    it('should listen for events', () => {
      expectSubscriptions(() => tag().init(), {
        [Events.RESULTS]: tag().updateDidYouMean
      });
    });
  });

  describe('send()', () => {
    it('should rewrite on send', (done) => {
      const newQuery = 'red sneakers';
      sandbox().stub(flux(), 'rewrite', (query) => {
        expect(query).to.eq(newQuery);
        done();
      });

      tag().send(<any>{ target: { text: newQuery } });
    });

    it('should emit tracker event', (done) => {
      const newQuery = 'red sneakers';
      sandbox().stub(flux(), 'rewrite', () => Promise.resolve());
      tag().services = <any>{ tracker: { didYouMean: () => done() } };

      tag().send(<any>{ target: { text: newQuery } });
    });
  });

  describe('updateDidYouMean()', () => {
    it('should call update() with didYouMean', () => {
      const dym = ['a', 'b', 'c'];
      const spy =
        tag().update =
        sinon.spy(({ didYouMean }) => expect(didYouMean).to.eq(dym));

      tag().updateDidYouMean(<any>{ didYouMean: dym });

      expect(spy.called).to.be.true;
    });
  });
});
