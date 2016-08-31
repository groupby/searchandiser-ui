import { FluxTag } from '../tag';
import { Events, PageInfo } from 'groupby-api';

export interface RecordCount extends FluxTag { }

export class RecordCount {

  first: number;
  last: number;
  total: number;

  init() {
    this.flux.on(Events.RESULTS, (res) => this.updatePageInfo(res));
  }

  updatePageInfo({ pageInfo, totalRecordCount }: { pageInfo: PageInfo, totalRecordCount: number }) {
    this.update({
      first: pageInfo.recordStart,
      last: pageInfo.recordEnd,
      total: totalRecordCount
    });
  }
}
