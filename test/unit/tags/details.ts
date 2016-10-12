import { Details, DEFAULT_CONFIG } from '../../../src/tags/details/gb-details';
import * as utils from '../../../src/utils/common';
import { ProductTransformer } from '../../../src/utils/product-transformer';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-details', Details, ({
  flux, tag, sandbox,
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
      const stub = sandbox().stub(flux(), 'details', (productId, field) => {
        expect(productId).to.eq(id);
        expect(field).to.eq(idField);
      });
      sandbox().stub(utils, 'getParam', (idParam) => {
        expect(idParam).to.eq('id');
        return id;
      });
      tag().config = { structure: { id: idField } };

      tag().init();

      expect(stub.called).to.be.true;
    });
  });

  describe('updateRecord()', () => {
    it('should update record', () => {
      const allMeta = { a: 'b', c: 'd' };
      const spy = tag().update = sinon.spy((obj) => {
        expect(obj.allMeta).to.eql(allMeta);
        expect(obj.productMeta).to.be.a('function');
      });
      tag().transformer = <any>{ transform: (meta) => () => meta };

      tag().updateRecord(<any>{ allMeta });

      expect(spy.called).to.be.true;
    });
  });
});
