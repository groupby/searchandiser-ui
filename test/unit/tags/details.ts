import { FluxCapacitor, Events } from 'groupby-api';
import { fluxTag } from '../../utils/tags';
import { Details } from '../../../src/tags/details/gb-details';
import { expect } from 'chai';

describe('gb-details logic', () => {
  let tag: Details,
    flux: FluxCapacitor;

  beforeEach(() => ({ tag, flux } = fluxTag(new Details())));

  it('should have default values', () => {
    tag.init();

    expect(tag.idParam).to.eq('id');
    expect(tag.query).to.not.be.ok;
    expect(tag.getPath).to.be.a('function');
  });

  it('should allow override from opts', () => {
    tag.opts.idParam = 'productId';
    tag.init();

    expect(tag.idParam).to.eq('productId');
  });

  it('should listen for events', () => {
    flux.on = (event: string): any => expect(event).to.eq(Events.DETAILS);

    tag.init();
  });

  it('should update selected on DETAILS', () => {
    const record = { a: 'b', c: 'd' };

    let callback;
    flux.on = (event: string, cb: Function): any => callback = cb;

    tag.update = (obj: any) => expect(obj.record).to.eq(record);;
    tag.init();

    callback(record);
  });
});
