import { FluxCapacitor, Events } from 'groupby-api';
import { fluxTag } from '../utils/tags';
import { RelatedQueries } from '../../src/tags/related-queries/gb-related-queries';
import { expect } from 'chai';

describe('gb-related-queries logic', () => {
  let tag: RelatedQueries,
    flux: FluxCapacitor;

  beforeEach(() => ({ tag, flux } = fluxTag(new RelatedQueries())));

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
