import { FluxTag } from '../tag';
import { Events } from 'groupby-api';

export interface RecordCount extends FluxTag { }

export class RecordCount {

  init() {
    this.opts.flux.on(Events.RESULTS, ({ pageInfo, totalRecordCount }) => this.update({
      first: pageInfo.recordStart,
      last: pageInfo.recordEnd,
      total: totalRecordCount
    }));
  }
}
