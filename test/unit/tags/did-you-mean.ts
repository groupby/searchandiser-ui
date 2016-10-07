import { DidYouMean } from '../../../src/tags/did-you-mean/gb-did-you-mean';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-did-you-mean', DidYouMean, ({ flux, tag, expectSubscriptions }) => {

  describe('init()', () => {
    it('should listen for events', () => {
      expectSubscriptions(() => tag().init(), {
        [Events.RESULTS]: tag().updateDidYouMean
      });
    });
  });

  describe('send()', () => {
    it('should rewrite on send', () => {
      const newQuery = 'red sneakers';

      flux().rewrite = (query: string): any => expect(query).to.eq(newQuery);

      tag().init();

      tag().send(<any>{ target: { text: newQuery } });
    });
  });

  describe('updateDidYouMean()', () => {
    it('should call update() with didYouMean', () => {
      const dym = ['a', 'b', 'c'];
      tag().update = ({ didYouMean }) => expect(didYouMean).to.eq(dym);

      tag().updateDidYouMean(<any>{ didYouMean: dym });
    });
  });
});
