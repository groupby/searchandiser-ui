import { META, Results } from '../../../src/tags/results/gb-results';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-results', Results, ({
  flux, tag, spy,
  expectSubscriptions,
  itShouldAlias,
  itShouldHaveMeta
}) => {
  itShouldHaveMeta(Results, META);

  describe('init()', () => {
    beforeEach(() => tag().config = <any>{ structure: {} });

    itShouldAlias('productable');

    it('should listen for events', () => {
      expectSubscriptions(() => tag().init(), {
        [Events.RESULTS]: tag().updateRecords
      });
    });
  });

  describe('setDefaults()', () => {
    it('should set structure from config', () => {
      const structure = { a: 'b' };
      tag().config = <any>{ structure: { c: 'd' } };

      tag().setDefaults({ structure });

      expect(tag().structure).to.eq(structure);
    });

    it('should set structure from global config', () => {
      const structure = { a: 'b' };
      tag().config = <any>{ structure };

      tag().setDefaults({});

      expect(tag().structure).to.eq(structure);
    });
  });

  describe('updateRecords()', () => {
    it('should update selected on RESULTS', () => {
      const records = [{ a: 'b' }, { c: 'd' }];
      const collection = 'mycollection';
      const update = tag().update = spy();
      flux().query.withConfiguration({ collection });

      tag().updateRecords(<any>{ records });

      expect(update).to.be.calledWith({ records, collection });
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
