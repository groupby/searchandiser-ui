import { Results } from '../../../src/tags/results/gb-results';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-results', Results, ({ flux, tag, expectSubscriptions }) => {

  describe('init()', () => {
    it('should have default values', () => {
      const structure = { a: 'b' };
      tag().config = { structure };
      tag().init();

      expect(tag().struct).to.eq(structure);
      expect(tag().variantStruct).to.eq(structure);
      expect(tag().getPath).to.be.a('function');
    });

    it('should set variantStruct from _variantStructure', () => {
      const varStruct = { c: 'd' };
      const structure = { _variantStructure: varStruct };
      tag().config = { structure };
      tag().init();

      expect(tag().variantStruct).to.eq(varStruct);
    });

    it('should listen for events', () => {
      tag().config = { structure: {} };

      expectSubscriptions(() => tag().init(), {
        [Events.RESULTS]: tag().updateRecords
      });
    });
  });

  describe('updateRecords()', () => {
    it('should update selected on RESULTS', () => {
      const records = [{ a: 'b' }, { c: 'd' }];
      const collection = 'mycollection';
      flux().query.withConfiguration({ collection });
      const spy =
        tag().update =
        sinon.spy((obj) => {
          expect(obj.records).to.eq(records);
          expect(obj.collection).to.eq(collection);
        });

      tag().updateRecords(<any>{ records });

      expect(spy.called).to.be.true;
    });
  });

  describe('userStyle()', () => {
    it('should return the correct user style', () => {
      const name = 'record-label';
      tag().opts.css = { label: name };

      expect(tag().userStyle('label')).to.eq(name);
    });

    it('should return no user style', () => {
      expect(tag().userStyle('label')).to.eq('');
    });
  });
});
