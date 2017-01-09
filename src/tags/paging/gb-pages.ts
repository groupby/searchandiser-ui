import { FluxTag } from '../tag';
import { Paging } from './gb-paging';

export interface Pages extends FluxTag<any> {
  $pageable: Paging;
}

export class Pages {

  jumpTo({ target }: any) {
    this.$pageable.pager.switchPage(Number(target.text));
  }
}
