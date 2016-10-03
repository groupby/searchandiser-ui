import { getPath, unless } from '../../utils/common';
import { SelectTag } from '../select/gb-select';

export interface PageSize extends SelectTag { }

export class PageSize {

  _config: any;

  init() {
    this.options = unless(this.config.pageSizes, [10, 25, 50, 100]);
    this._config = getPath(this.config, 'tags.pageSize') || this.opts;
  }

  onselect(value: number) {
    this.flux.resize(value, this.opts.resetOffset);
  }
}
