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
      const items = ['a', 'b', 'c'];
      const update = tag().update = spy();

      tag().updatedRelatedQueries(<any>{ relatedQueries: items });

      expect(update).to.be.calledWith({ items });
    });
  });

  describe('onSelect()', () => {
    it('should call flux.rewrite()', () => {
      const text = 'red sneakers';
      const rewrite = stub(flux(), 'rewrite');

      tag().onSelect(<any>{ target: { text } });

      expect(rewrite).to.be.calledWith(text);
    });
  });
});
