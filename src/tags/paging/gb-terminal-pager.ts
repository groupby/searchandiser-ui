import { FluxTag } from '../tag';
import { PagingConfig } from './gb-paging';

export interface TerminalPager extends FluxTag<PagingConfig> { }

export class TerminalPager {

  init() {
    this.$scopeTo('gb-paging');
    this.$config = this.$scope.$config;
  }
}
