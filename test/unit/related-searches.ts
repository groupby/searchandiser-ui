import { FluxCapacitor, Events } from 'groupby-api';
import { RelatedSearches } from '../../src/tags/related-searches/gb-related-searches';
import { expect } from 'chai';

describe('gb-related-searches logic', () => {
  let relatedSearches: RelatedSearches;
  let flux: FluxCapacitor;
  beforeEach(() => {
    relatedSearches = new RelatedSearches();
    flux = new FluxCapacitor('');
    relatedSearches.opts = { flux };
  });

  it('should rewrite on send', () => {
    const query = 'red sneakers';

    flux.rewrite = (query: string): any => expect(query).to.eq(query);

    relatedSearches.init();

    relatedSearches.send(<Event & any>{ target: { text: query } });
  });

  it('should listen for events', () => {
    flux.on = (event: string): any => expect(event).to.eq(Events.RESULTS);

    relatedSearches.init();
  });

  it('should update relatedQueries on RESULTS', () => {
    const relatedQueries = ['a', 'b', 'c'];
    let callback;

    flux.on = (event: string, cb: Function): any => callback = cb;

    relatedSearches.update = (obj: any) => expect(obj.relatedQueries).to.eq(relatedQueries);
    relatedSearches.init();

    callback({ relatedQueries });
  });
});
