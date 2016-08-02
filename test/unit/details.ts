import { FluxCapacitor, Events } from 'groupby-api';
import { Details } from '../../src/tags/details/gb-details';
import { expect } from 'chai';

describe('gb-details logic', () => {
  let details: Details;
  let flux: FluxCapacitor;
  beforeEach(() => {
    details = new Details();
    flux = new FluxCapacitor('');
    details.opts = { flux, config: {} };
  });

  it('should have default values', () => {
    details.init();
    expect(details.idParam).to.eq('id');
    expect(details.query).to.not.be.ok;
    expect(details.struct).to.not.be.ok;
    expect(details.getPath).to.be.a('function');
  });

  it('should allow override from opts', () => {
    const structure = { a: 'b', c: 'd' };
    Object.assign(details.opts, { config: { structure }, idParam: 'productId' });
    details.init();
    expect(details.struct).to.eq(structure);
    expect(details.idParam).to.eq('productId');
  });

  it('should listen for events', () => {
    flux.on = (event: string): any => expect(event).to.eq(Events.DETAILS);
    details.init();
  });

  it('should update selected on DETAILS', (done) => {
    const record = { a: 'b', c: 'd' };
    let callback;
    flux.on = (event: string, cb: Function): any => callback = cb;
    details.update = (obj: any) => {
      expect(obj.record).to.eq(record);
      done();
    };
    details.init();
    callback(record);
  });
});
