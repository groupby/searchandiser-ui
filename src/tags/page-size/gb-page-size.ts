import { Selectable, SelectTag } from '../select/gb-select';
import { TagConfigure } from '../tag';

export interface PageSizeOpts extends Selectable {
  resetOffset?: boolean;
}

export const TYPES = {
  resetOffset: 'boolean'
};
export const DEFAULT_PAGE_SIZES = [10, 25, 50, 100];

export class PageSize extends SelectTag<PageSizeOpts> {

  resetOffset: boolean;

  init() {
    this.expose('selectable');
  }

  onConfigure(configure: TagConfigure) {
    configure({ types: TYPES });

    this.items = this.config.pageSizes || DEFAULT_PAGE_SIZES;
  }

  onSelect(value: number) {
    return this.flux.resize(value, this.resetOffset)
      .then(() => this.services.tracker && this.services.tracker.search());
  }
}
