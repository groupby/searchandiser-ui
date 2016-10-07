import { RelatedQueries } from '../../../src/tags/related-queries/gb-related-queries';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-related-queries', RelatedQueries, ({
  flux, tag,
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
      tag().update = (obj: any) => expect(obj.relatedQueries).to.eq(relatedQueries);

      tag().updatedRelatedQueries(<any>{ relatedQueries });
    });
  });

  describe('send()', () => {
    it('should call flux.rewrite()', () => {
      const newQuery = 'red sneakers';

      flux().rewrite = (query: string): any => expect(query).to.eq(newQuery);

      tag().send(<any>{ target: { text: newQuery } });
    });
  });
});
