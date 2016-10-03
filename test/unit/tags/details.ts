import { Details } from '../../../src/tags/details/gb-details';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-details', Details, ({ flux, tag }) => {
  it('should have default values', () => {
    tag().init();

    expect(tag().idParam).to.eq('id');
    expect(tag().query).to.not.be.ok;
  });

  it('should allow override from opts', () => {
    tag().opts.idParam = 'productId';
    tag().init();

    expect(tag().idParam).to.eq('productId');
  });

  it('should call updateRecord() on details event', () => {
    flux().on = (event, cb): any => {
      expect(event).to.eq(Events.DETAILS);
      expect(cb).to.eq(tag().updateRecord);
    };

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
