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

  describe('send()', () => {
    it('should rewrite on send', (done) => {
      const newQuery = 'red sneakers';
      flux().rewrite = (query): any => {
        expect(query).to.eq(newQuery);
        done();
      };

      tag().send(<any>{ target: { text: newQuery } });
    });

    it('should emit tracker event', (done) => {
      const didYouMean = spy();
      const rewrite = stub(flux(), 'rewrite').returns(Promise.resolve());
      tag().services = <any>{ tracker: { didYouMean } };

      tag().send(<any>{ target: {} })
        .then(() => {
          expect(didYouMean.called).to.be.true;
          expect(rewrite.called).to.be.true;
          done();
        });
    });

    it('should check for tracker service', (done) => {
      stub(flux(), 'rewrite').returns(Promise.resolve());
      tag().services = <any>{};

      tag().send(<any>{ target: {} })
        .then(() => done());
    });
  });

  describe('updateDidYouMean()', () => {
    it('should call update() with didYouMean', () => {
      const didYouMean = ['a', 'b', 'c'];
      const update = tag().update = spy();

      tag().updateDidYouMean(<any>{ didYouMean });

      expect(update.calledWith({ didYouMean })).to.be.true;
    });
  });
});
