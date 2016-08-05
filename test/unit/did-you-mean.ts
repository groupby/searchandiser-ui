import { FluxCapacitor, Events } from 'groupby-api';
import { DidYouMean } from '../../src/tags/did-you-mean/gb-did-you-mean';
import { expect } from 'chai';

describe('gb-did-you-mean logic', () => {
  let didYouMean: DidYouMean,
    flux: FluxCapacitor;

  beforeEach(() => didYouMean = Object.assign(new DidYouMean(), {
    flux: flux = new FluxCapacitor('')
  }));

  it('should rewrite on send', () => {
    const query = 'red sneakers';

    flux.rewrite = (query: string): any => expect(query).to.eq(query);

    didYouMean.init();

    didYouMean.send(<Event & any>{ target: { text: query } });
  });

  it('should listen for events', () => {
    flux.on = (event: string): any => expect(event).to.eq(Events.RESULTS);

    didYouMean.init();
  });

  it('should update didYouMean on RESULTS', () => {
    const dym = ['a', 'b', 'c'];

    let callback;
    flux.on = (event: string, cb: Function): any => callback = cb;

    didYouMean.update = (obj: any) => expect(obj.didYouMean).to.eq(dym);
    didYouMean.init();

    callback({ didYouMean: dym });
  });
});
