import { Details, DEFAULT_CONFIG } from '../../../src/tags/details/gb-details';
import * as utils from '../../../src/utils/common';
import { ProductTransformer } from '../../../src/utils/product-transformer';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-details', Details, ({
  flux, tag, spy, stub,
  expectSubscriptions,
  itShouldConfigure
}) => {

  describe('init()', () => {
    itShouldConfigure(DEFAULT_CONFIG);

    it('should have default values', () => {
      tag().init();

      expect(tag().query).to.not.be.ok;
      expect(tag().struct).to.eql({});
      expect(tag().transformer).to.be.an.instanceof(ProductTransformer);
    });

    it('should allow override from config', () => {
      const structure = { a: 'b', c: 'd' };
      tag().config = { structure };

      tag().init();

      expect(tag().struct).to.eq(structure);
    });

    it('should listen for details event', () => {
      expectSubscriptions(() => tag().init(), {
        [Events.DETAILS]: tag().updateRecord
      });
    });

    it('should call flux.details() if query is found', () => {
      const id = 1632;
      const idField = 'productId';
      const details = stub(flux(), 'details');
      const getParam = stub(utils, 'getParam').returns(id);
      tag().config = { structure: { id: idField } };

      tag().init();

      expect(getParam).to.have.been.calledWith('id');
      expect(details).to.have.been.calledWith(id, idField);
    });
  });

  describe('updateRecord()', () => {
    it('should update record', () => {
      const allMeta = { a: 'b', c: 'd' };
      const update = tag().update = spy();
      tag().transformer = <any>{ transform: (meta) => () => meta };

      tag().updateRecord(<any>{ allMeta });

      expect(update).to.have.been.calledWith({
        allMeta,
        productMeta: sinon.match.func
      });
    });
  });
});
