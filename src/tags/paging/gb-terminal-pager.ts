import { FluxTag } from '../tag';
import { PagingConfig } from './gb-paging';

export interface TerminalPager extends FluxTag<PagingConfig> { }

export class TerminalPager {

  init() {
    this._scopeTo('gb-paging');
    this._config = this._scope._config;
  }
}
