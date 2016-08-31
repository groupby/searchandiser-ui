import { DidYouMean } from '../../../src/tags/did-you-mean/gb-did-you-mean';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-did-you-mean', DidYouMean, ({ flux, tag }) => {
  it('should rewrite on send', () => {
    const newQuery = 'red sneakers';

    flux().rewrite = (query: string): any => expect(query).to.eq(newQuery);

    tag().init();

    tag().send(<Event & any>{ target: { text: newQuery } });
  });

  it('should listen for events', () => {
    flux().on = (event: string): any => expect(event).to.eq(Events.RESULTS);

    tag().init();
  });

  it('should update didYouMean on RESULTS', () => {
    const dym = ['a', 'b', 'c'];

    let callback;
    flux().on = (event: string, cb: Function): any => callback = cb;

    tag().update = (obj: any) => expect(obj.didYouMean).to.eq(dym);
    tag().init();

    callback({ didYouMean: dym });
  });
});
