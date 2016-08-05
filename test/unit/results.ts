import { FluxCapacitor, Events } from 'groupby-api';
import { Results } from '../../src/tags/results/gb-results';
import { expect } from 'chai';

describe('gb-results logic', () => {
  const structure = { title: 'title', price: 'price', image: 'image' };
  let results: Results,
    flux: FluxCapacitor;

  beforeEach(() => results = Object.assign(new Results(), {
    flux: flux = new FluxCapacitor(''),
    config: { structure },
    opts: {}
  }));

  it('should have default values', () => {
    results.init();

    expect(results.getPath).to.be.a('function');
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
