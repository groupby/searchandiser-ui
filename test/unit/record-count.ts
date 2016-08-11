import { FluxCapacitor, Events } from 'groupby-api';
import { fluxTag } from '../utils/tags';
import { RecordCount } from '../../src/tags/record-count/gb-record-count';
import { expect } from 'chai';

describe('gb-record-count logic', () => {
  let tag: RecordCount,
    flux: FluxCapacitor;

  beforeEach(() => ({ tag, flux } = fluxTag(new RecordCount())));

  it('should listen for events', () => {
    flux.on = (event: string): any => expect(event).to.eq(Events.RESULTS);

    tag.init();
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

    tag.update = (obj: any) => {
      expect(obj.first).to.eq(results.pageInfo.recordStart);
      expect(obj.last).to.eq(results.pageInfo.recordEnd);
      expect(obj.total).to.eq(results.totalRecordCount);
    };
    tag.init();

    callback(results);
  });
});
