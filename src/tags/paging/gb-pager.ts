import { FluxTag } from '../tag';
import { PagingConfig } from './gb-paging';

export interface Pager extends FluxTag<PagingConfig> { }

export class Pager {

  init() {
    this._scopeTo('gb-paging');
    this._config = this._scope._config;
  }
}
