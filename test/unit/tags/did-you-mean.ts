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
      const stub = sandbox().stub(flux(), 'rewrite', (query) =>
        Promise.resolve(expect(query).to.eq(newQuery)));
      tag().services = <any>{
        tracker: {
          didYouMean: () => {
            expect(stub.called).to.be.true;
            done();
          }
        }
      };

      tag().send(<any>{ target: { text: newQuery } });

      expect(stub.called).to.be.true;
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
