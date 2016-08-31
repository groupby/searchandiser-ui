import { RecordCount } from '../../../src/tags/record-count/gb-record-count';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-record-count', RecordCount, ({ flux, tag }) => {
  it('should listen for events', () => {
    flux().on = (event: string): any => expect(event).to.eq(Events.RESULTS);

    tag().init();
  });

  it('should update page info on RESULTS', () => {
    const results = {
      pageInfo: {
        recordStart: 20,
        recordEnd: 40
      },
      totalRecordCount: 300
    };
    let callback;

    flux().on = (event: string, cb: Function): any => callback = cb;

    tag().update = (obj: any) => {
      expect(obj.first).to.eq(results.pageInfo.recordStart);
      expect(obj.last).to.eq(results.pageInfo.recordEnd);
      expect(obj.total).to.eq(results.totalRecordCount);
    };
    tag().init();

    callback(results);
  });
});
