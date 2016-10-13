import { RecordCount } from '../../../src/tags/record-count/gb-record-count';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-record-count', RecordCount, ({ tag, spy, expectSubscriptions }) => {

  describe('init()', () => {
    it('should listen for events', () => {
      expectSubscriptions(() => tag().init(), {
        [Events.RESULTS]: tag().updatePageInfo
      });
    });
  });

  describe('updatePageInfo()', () => {
    it('should call update with first, last, total', () => {
      const recordStart = 20;
      const recordEnd = 40;
      const totalRecordCount = 300;
      const results = { pageInfo: { recordStart, recordEnd }, totalRecordCount };
      const update = tag().update = spy();

      tag().updatePageInfo(results);

      expect(update.calledWith({
        first: recordStart,
        last: recordEnd,
        total: totalRecordCount
      })).to.be.true;
    });
  });
});
