import { FluxCapacitor, Events } from 'groupby-api';
import { Results } from '../../src/tags/results/gb-results';
import { expect } from 'chai';

describe('gb-results logic', () => {
  const structure = { title: 'title', price: 'price', image: 'image' };
  let results: Results;
  let flux: FluxCapacitor;
  beforeEach(() => {
    results = new Results();
    flux = new FluxCapacitor('');
    results.opts = { flux, config: { structure } };
  });

  it('should have default values', () => {
    results.init();

    expect(results.struct).to.eq(structure);
    expect(results.getPath).to.be.a('function');
  });

  it('should allow override from parent', () => {
    const struct = { a: 'b', c: 'd' };
    results.parent = <any>{ struct };
    results.init();

    expect(results.struct).to.eq(struct);
  });

  it('should listen for events', () => {
    flux.on = (event: string): any => expect(event).to.eq(Events.RESULTS);

    results.init();
  });

  it('should update selected on RESULTS', () => {
    const records = [{ a: 'b' }, { c: 'd' }];
    let callback;

    flux.on = (event: string, cb: Function): any => callback = cb;

    results.update = (obj: any) => expect(obj.records).to.eq(records);;
    results.init();

    callback({ records });
  });

  it('should return the correct user style', () => {
    const name = 'record-label';
    results.opts.css = { label: name };
    expect(results.userStyle('label')).to.eq(name);
  });

  it('should return no user style', () => {
    expect(results.userStyle('label')).to.eq('');
  });
});
