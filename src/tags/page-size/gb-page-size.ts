import { checkBooleanAttr } from '../../utils/common';
import { Selectable } from '../select/gb-select';
import { FluxTag } from '../tag';

export interface PageSizeConfig extends Selectable {
  resetOffset?: boolean;
}

export interface PageSize extends FluxTag<any>, Selectable { }

export class PageSize {
  resetOffset: boolean;

  init() {
    this.resetOffset = checkBooleanAttr('resetOffset', this.opts);

    this.options = this.config.pageSizes || [10, 25, 50, 100];
  }

  onselect(value: number) {
    return this.flux.resize(value, this.resetOffset)
      .then(() => this.services.tracker && this.services.tracker.search());
  }
}
