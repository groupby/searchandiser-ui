import { FluxCapacitor, Events } from 'groupby-api';
import { Details } from '../../src/tags/details/gb-details';
import { expect } from 'chai';
import qs = require('query-string');

describe('gb-details logic', () => {
  let details: Details;
  const flux = new FluxCapacitor('');
  beforeEach(() => {
    details = new Details();
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
    Object.assign(details.opts, {
      flux: {
        on: (event: string) => expect(event).to.eq(Events.DETAILS)
      }
    });
    details.init();
  });

  it('should update selected on DETAILS', (done) => {
    const record = { a: 'b', c: 'd' };
    let callback;
    Object.assign(details.opts, {
      flux: {
        on: (event: string, cb: Function) => {
          if (event === Events.DETAILS) callback = cb;
        }
      }
    });
    details.update = (obj: any) => {
      expect(obj.record).to.eq(record);
      done();
    };
    details.init();
    callback(record);
  });
});
