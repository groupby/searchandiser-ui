import { FluxTag } from '../tag';
import { Events, PageInfo } from 'groupby-api';

export class RecordCount extends FluxTag<any>  {

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
