import { checkBooleanAttr } from '../../utils/common';
import { Selectable, SelectTag } from '../select/gb-select';

export interface PageSizeConfig extends Selectable {
  resetOffset?: boolean;
}

export class PageSize extends SelectTag<any> {

  resetOffset: boolean;

  init() {
    this.alias('selectable');

    this.resetOffset = checkBooleanAttr('resetOffset', this.opts);

    this.items = this.config.pageSizes || [10, 25, 50, 100];
  }

  onSelect(value: number) {
    return this.flux.resize(value, this.resetOffset)
      .then(() => this.services.tracker && this.services.tracker.search());
  }
}
