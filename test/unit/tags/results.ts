import { Results, TYPES } from '../../../src/tags/results/gb-results';
import { getPath } from '../../../src/utils/common';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-results', Results, ({
  flux, tag, spy,
  expectSubscriptions,
  itShouldAlias
}) => {

  describe('init()', () => {
    beforeEach(() => tag().config = { structure: {} });

    itShouldAlias('productable');

    it('should mixin getPath()', () => {
      const mixin = tag().mixin = spy();

      tag().init();

      expect(mixin).to.have.been.calledWith({ getPath });
    });

    it('should listen for events', () => {
      expectSubscriptions(() => tag().init(), {
        [Events.RESULTS]: tag().updateRecords
      });
    });
  });

  describe('onConfigure()', () => {
    it('should call configure()', () => {
      const configure = spy();

      tag().onConfigure(configure);

      expect(configure).to.have.been.calledWith({ types: TYPES });
    });

    it('should set structure from global config', () => {
      const structure = { a: 'b' };
      tag().config = { structure };

      tag().onConfigure(() => null);

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
