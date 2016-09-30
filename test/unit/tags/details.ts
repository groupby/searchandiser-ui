import { Details, DEFAULT_CONFIG } from '../../../src/tags/details/gb-details';
import * as utils from '../../../src/utils/common';
import { ProductTransformer } from '../../../src/utils/product-transformer';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-details', Details, ({ flux, tag }) => {
  it('should configure itself with defaults', (done) => {
    tag().configure = (defaults) => {
      expect(defaults).to.eq(DEFAULT_CONFIG);
      done();
    };

    tag().init();
  });

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

  it('should call updateRecord() on details event', () => {
    flux().on = (event, cb): any => {
      expect(event).to.eq(Events.DETAILS);
      expect(cb).to.eq(tag().updateRecord);
    };

    tag().init();
  });

  it('should call flux.details() if query is found', () => {
    const id = 1632;
    const idField = 'productId';
    sinon.stub(utils, 'getParam', (idParam) => {
      expect(idParam).to.eq('id');
      return id;
    });
    sinon.stub(flux(), 'details', (productId, field) => {
      expect(productId).to.eq(id);
      expect(field).to.eq(idField);
    });
    tag().config = { structure: { id: idField } };

    tag().init();
  });

  describe('updateRecord()', () => {
    it('should update record', () => {
      const record = { a: 'b', c: 'd' };

      tag().transformer = <any>{ transform: (allMeta) => () => allMeta };
      tag().update = (obj: any) => {
        expect(obj.allMeta).to.eql(record);
        expect(obj.productMeta).to.be.a('function');
      };

      tag().updateRecord(<any>{ allMeta: record });
    });
  });
});
