import { RelatedQueries } from '../../../src/tags/related-queries/gb-related-queries';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-related-queries', RelatedQueries, ({ flux, tag }) => {
  it('should rewrite on send', () => {
    const newQuery = 'red sneakers';

    flux().rewrite = (query: string): any => expect(query).to.eq(newQuery);

    tag().init();

    tag().send(<any>{ target: { text: newQuery } });
  });

  it('should listen for events', () => {
    flux().on = (event: string): any => expect(event).to.eq(Events.RESULTS);

    tag().init();
  });

  it('should update relatedQueries on RESULTS', () => {
    const relatedQueries = ['a', 'b', 'c'];
    let callback;

    flux().on = (event: string, cb: Function): any => callback = cb;

    tag().update = (obj: any) => expect(obj.relatedQueries).to.eq(relatedQueries);
    tag().init();

    callback({ relatedQueries });
  });
});
