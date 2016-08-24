import { FluxCapacitor, Events } from 'groupby-api';
import { fluxTag } from '../../utils/tags';
import { DidYouMean } from '../../../src/tags/did-you-mean/gb-did-you-mean';
import { expect } from 'chai';

describe('gb-did-you-mean logic', () => {
  let tag: DidYouMean,
    flux: FluxCapacitor;

  beforeEach(() => ({ tag, flux } = fluxTag(new DidYouMean())));

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

  it('should update didYouMean on RESULTS', () => {
    const dym = ['a', 'b', 'c'];

    let callback;
    flux.on = (event: string, cb: Function): any => callback = cb;

    tag.update = (obj: any) => expect(obj.didYouMean).to.eq(dym);
    tag.init();

    callback({ didYouMean: dym });
  });
});
