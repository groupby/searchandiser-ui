import { Events } from 'groupby-api';

export class RecordCount {

  opts: any;
  update: (any) => void;

  init() {
    this.opts.flux.on(Events.RESULTS, ({ pageInfo, totalRecordCount }) => this.update({
      first: pageInfo.recordStart,
      last: pageInfo.recordEnd,
      total: totalRecordCount
    }));
  }
}
