import { Details, META } from '../../../src/tags/details/gb-details';
import * as utils from '../../../src/utils/common';
import * as transform from '../../../src/utils/product-transformer';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-details', Details, ({
  flux, tag, spy, stub,
  expectSubscriptions,
  itShouldHaveMeta
}) => {
  itShouldHaveMeta(Details, META);

  describe('init()', () => {
    it('should listen for details event', () => {
      expectSubscriptions(() => tag().init(), {
        [Events.DETAILS]: tag().updateRecord
      });
    });
  });

  describe('setDefaults()', () => {
    it('should set structure from config', () => {
      const structure = { a: 'b' };

      tag().setDefaults(<any>{ structure });

      expect(tag().structure).to.eq(structure);
    });

    it('should set structure from global', () => {
      const structure = { a: 'b' };
      tag().config = <any>{ structure };

      tag().setDefaults(<any>{ structure });

      expect(tag().structure).to.eq(structure);
    });

    it('should initialize transformer', () => {
      const transformer = { a: 'b' };
      const structure = { c: 'd' };
      const productTransformer = stub(transform, 'ProductTransformer', () => transformer);

      tag().setDefaults(<any>{ structure });

      expect(tag().transformer).to.eq(transformer);
      expect(productTransformer).to.be.calledWith(structure);
    });
  });

  describe('requestDetails()', () => {
    it('should call flux.details()', () => {
      const idField = 'myId';
      const query = { a: 'b' };
      const idParam = tag().idParam = 'myQuery';
      const getParam = stub(utils, 'getParam', () => query);
      const details = stub(flux(), 'details');
      tag().transformer = <any>{ idField };

      tag().requestDetails();

      expect(getParam).to.be.calledWith(idParam);
      expect(details).to.be.calledWith(query, idField);
    });

    it('should not call flux.details()', () => {
      stub(utils, 'getParam', () => false);
      stub(flux(), 'details', () => expect.fail());

      tag().requestDetails();
    });
  });

  describe('updateRecord()', () => {
    it('should update gb-product tag', () => {
      const allMeta = { a: 'b', c: 'd' };
      const updateRecord = spy();
      const update = spy();
      tag().tags = <any>{ 'gb-product': { updateRecord, update } };

      tag().updateRecord(<any>{ allMeta });

      expect(updateRecord).to.be.calledWith(allMeta);
      expect(update).to.be.called;
    });
  });
});
