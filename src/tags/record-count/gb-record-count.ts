import { FluxTag } from '../tag';
import { Events, PageInfo } from 'groupby-api';

export interface RecordCount extends FluxTag<any> { }

export class RecordCount {

  first: number;
  last: number;
  total: number;

  init() {
    this.flux.on(Events.RESULTS, this.updatePageInfo);
  }

  updatePageInfo({ pageInfo, totalRecordCount }: { pageInfo: PageInfo, totalRecordCount: number }) {
    this.update({
      first: pageInfo.recordStart,
      last: pageInfo.recordEnd,
      total: totalRecordCount
    });
  }
}
