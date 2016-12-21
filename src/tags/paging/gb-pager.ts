import { FluxTag } from '../tag';
import { PagingConfig } from './gb-paging';

export interface Pager extends FluxTag<PagingConfig> { }

export class Pager {

  init() {
    this.$scopeTo('gb-paging');
    this.$config = this.$scope.$config;
    console.log(this.$computed);
  }
}
