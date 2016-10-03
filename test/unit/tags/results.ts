import { Results } from '../../../src/tags/results/gb-results';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

const structure = { title: 'title', price: 'price', image: 'image' };

suite('gb-results', Results, { config: { structure } }, ({ flux, tag }) => {

  describe('init()', () => {
    it('should have default values', () => {
      tag().init();

      expect(tag().getPath).to.be.a('function');
    });

    it('should listen for events', () => {
      flux().on = (event, cb): any => {
        expect(event).to.eq(Events.RESULTS);
        expect(cb).to.eq(tag().updateRecords);
      };

      tag().init();
    });
  });

  describe('updateRecords()', () => {
    it('should update selected on RESULTS', () => {
      const records = [{ a: 'b' }, { c: 'd' }];
      const collection = 'mycollection';

      flux().query.withConfiguration({ collection });

      tag().update = (obj: any) => {
        expect(obj.records).to.eq(records);
        expect(obj.collection).to.eq(collection);
      };
      tag().init();

      tag().updateRecords(<any>{ records });
    });
  });

  it('should return the correct user style', () => {
    const name = 'record-label';
    tag().opts.css = { label: name };
    expect(tag().userStyle('label')).to.eq(name);
  });

  it('should return no user style', () => {
    expect(tag().userStyle('label')).to.eq('');
  });
});
