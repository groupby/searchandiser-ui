import { FluxCapacitor, Events } from 'groupby-api';
import { RecordCount } from '../../src/tags/record-count/gb-record-count';
import { expect } from 'chai';

describe('gb-record-count logic', () => {
  let recordCount: RecordCount;
  let flux: FluxCapacitor;
  beforeEach(() => {
    recordCount = new RecordCount();
    flux = new FluxCapacitor('');
    recordCount.opts = { flux };
  });

  it('should listen for events', () => {
    flux.on = (event: string): any => expect(event).to.eq(Events.RESULTS);

    recordCount.init();
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

    flux.on = (event: string, cb: Function): any => callback = cb;

    recordCount.update = (obj: any) => {
      expect(obj.first).to.eq(results.pageInfo.recordStart);
      expect(obj.last).to.eq(results.pageInfo.recordEnd);
      expect(obj.total).to.eq(results.totalRecordCount);
    };
    recordCount.init();

    callback(results);
  });
});
