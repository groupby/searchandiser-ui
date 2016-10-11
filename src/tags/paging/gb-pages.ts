import { FluxTag } from '../tag';
import { PagingConfig } from './gb-paging';

export interface Pages extends FluxTag<PagingConfig> { }

export class Pages {

  init() {
    this._scopeTo('gb-paging');
    this._config = this._scope._config;
  }

  jumpTo({ target }: any) {
    this._scope.pager.switchPage(Number(target.text));
  }
}
