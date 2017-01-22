import { Results, TYPES } from '../../../src/tags/results/gb-results';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-results', Results, ({
  flux, tag, spy,
  expectSubscriptions,
  itShouldAlias
}) => {

  describe('init()', () => {
    beforeEach(() => tag().config = <any>{ structure: {} });

    itShouldAlias('productable');

    it('should listen for events', () => {
      expectSubscriptions(() => tag().init(), {
        [Events.RESULTS]: tag().updateRecords
      });
    });
  });

  describe('onConfigure()', () => {
    it('should call configure()', () => {
      const configure = spy(() => ({}));

      tag().onConfigure(configure);

      expect(configure).to.have.been.calledWith({ types: TYPES });
    });

    it('should set structure from config', () => {
      const structure = { a: 'b' };
      tag().config = <any>{ structure: { c: 'd' } };

      tag().onConfigure(() => ({ structure }));

      expect(tag().structure).to.eq(structure);
    });

    it('should set structure from global config', () => {
      const structure = { a: 'b' };
      tag().config = <any>{ structure };

      tag().onConfigure(() => ({}));

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

      expect(update).to.have.been.calledWith({ records, collection });
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
