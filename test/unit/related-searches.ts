import { FluxCapacitor, Events } from 'groupby-api';
import { fluxTag } from '../utils/tags';
import { RelatedSearches } from '../../src/tags/related-searches/gb-related-searches';
import { expect } from 'chai';

describe('gb-related-searches logic', () => {
  let tag: RelatedSearches,
    flux: FluxCapacitor;

  beforeEach(() => ({ tag, flux } = fluxTag(new RelatedSearches())));

  it('should rewrite on send', () => {
    const query = 'red sneakers';

    flux.rewrite = (query: string): any => expect(query).to.eq(query);

    tag.init();

    tag.send(<Event & any>{ target: { text: query } });
  });

  it('should listen for events', () => {
    flux.on = (event: string): any => expect(event).to.eq(Events.RESULTS);

    tag.init();
  });

  it('should update relatedQueries on RESULTS', () => {
    const relatedQueries = ['a', 'b', 'c'];
    let callback;

    flux.on = (event: string, cb: Function): any => callback = cb;

    tag.update = (obj: any) => expect(obj.relatedQueries).to.eq(relatedQueries);
    tag.init();

    callback({ relatedQueries });
  });
});
