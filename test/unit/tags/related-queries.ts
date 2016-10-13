import { RelatedQueries } from '../../../src/tags/related-queries/gb-related-queries';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-related-queries', RelatedQueries, ({
  flux, tag, spy, stub,
  expectSubscriptions
}) => {

  describe('init()', () => {
    it('should listen for results', () => {
      expectSubscriptions(() => tag().init(), {
        [Events.RESULTS]: tag().updatedRelatedQueries
      });
    });
  });

  describe('updatedRelatedQueries()', () => {
    it('should call update() with relatedQueries', () => {
      const relatedQueries = ['a', 'b', 'c'];
      const update = tag().update = spy();

      tag().updatedRelatedQueries(<any>{ relatedQueries });

      expect(update.calledWith({ relatedQueries })).to.be.true;
    });
  });

  describe('send()', () => {
    it('should call flux.rewrite()', () => {
      const newQuery = 'red sneakers';
      const rewrite = stub(flux(), 'rewrite');

      tag().send(<any>{ target: { text: newQuery } });

      expect(rewrite.calledWith(newQuery)).to.be.true;
    });
  });
});
