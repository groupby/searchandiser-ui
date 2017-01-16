import { Selectable, SelectTag } from '../select/gb-select';
import { TagConfigure } from '../tag';

export interface PageSizeConfig extends Selectable {
  resetOffset?: boolean;
}

export const TYPES = {
  resetOffset: 'boolean'
};

export class PageSize extends SelectTag<any> {

  resetOffset: boolean;

  init() {
    this.alias('selectable');
  }

  onConfigure(configure: TagConfigure) {
    configure({ types: TYPES });

    this.items = this.config.pageSizes || [10, 25, 50, 100];
  }

  onSelect(value: number) {
    return this.flux.resize(value, this.resetOffset)
      .then(() => this.services.tracker && this.services.tracker.search());
  }
}
