import { RecordCount } from '../../../src/tags/record-count/gb-record-count';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-record-count', RecordCount, ({ tag, expectSubscriptions }) => {

  describe('init()', () => {
    it('should listen for events', () => {
      expectSubscriptions(() => tag().init(), {
        [Events.RESULTS]: tag().updatePageInfo
      });
    });
  });

  describe('updatePageInfo()', () => {
    it('should call update with first, last, total', () => {
      const results = {
        pageInfo: {
          recordStart: 20,
          recordEnd: 40
        },
        totalRecordCount: 300
      };
      tag().update = (obj) => {
        expect(obj.first).to.eq(results.pageInfo.recordStart);
        expect(obj.last).to.eq(results.pageInfo.recordEnd);
        expect(obj.total).to.eq(results.totalRecordCount);
      };

      tag().updatePageInfo(results);
    });
  });
});
