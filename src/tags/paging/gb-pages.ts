import { FluxTag } from '../tag';
import { PagingConfig } from './gb-paging';

export interface Pages extends FluxTag<PagingConfig> { }

export class Pages {

  jumpTo({ target }: any) {
    this.$computed.switchPage(Number(target.text));
  }
}
