import { FluxTag } from '../tag';
import { PagingConfig } from './gb-paging';

export interface Pages extends FluxTag<PagingConfig> { }

export class Pages {

  init() {
    this.$scopeTo('gb-paging');
    this.$config = this.$scope.$config;
  }

  jumpTo({ target }: any) {
    this.$scope.pager.switchPage(Number(target.text));
  }
}
