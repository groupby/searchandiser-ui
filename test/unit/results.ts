import { FluxCapacitor, Events } from 'groupby-api';
import { fluxTag } from '../utils/tags';
import { Results } from '../../src/tags/results/gb-results';
import { expect } from 'chai';

describe('gb-results logic', () => {
  const structure = { title: 'title', price: 'price', image: 'image' };
  let tag: Results,
    flux: FluxCapacitor;

  beforeEach(() => ({ tag, flux } = fluxTag(new Results(), {
    config: { structure }
  })));

  it('should have default values', () => {
    tag.init();

    expect(tag.getPath).to.be.a('function');
  });

  it('should listen for events', () => {
    flux.on = (event: string): any => expect(event).to.eq(Events.RESULTS);

    tag.init();
  });

  it('should update selected on RESULTS', () => {
    const records = [{ a: 'b' }, { c: 'd' }];
    const collection = 'mycollection';
    let callback;

    flux.query.withConfiguration({ collection });
    flux.on = (event: string, cb: Function): any => callback = cb;

    tag.update = (obj: any) => {
      expect(obj.records).to.eq(records);
      expect(obj.collection).to.eq(collection);
    };
    tag.init();

    callback({ records });
  });

  it('should return the correct user style', () => {
    const name = 'record-label';
    tag.opts.css = { label: name };
    expect(tag.userStyle('label')).to.eq(name);
  });

  it('should return no user style', () => {
    expect(tag.userStyle('label')).to.eq('');
  });
});
