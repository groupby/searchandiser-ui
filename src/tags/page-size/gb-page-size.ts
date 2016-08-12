import { unless } from '../../utils';
import { SelectTag } from '../select/gb-select';

export interface PageSize extends SelectTag { }

export class PageSize {

  init() {
    this.options = unless(this.config.pageSizes, [10, 25, 50, 100]);
  }

  onselect(value) {
    return this.flux.resize(value, this.opts.resetOffset ? 0 : undefined);
  }
}
