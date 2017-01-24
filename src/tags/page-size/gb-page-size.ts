import { meta } from '../../utils/decorators';
import { Selectable, SelectTag } from '../select/gb-select';
import { TagMeta } from '../tag';

export interface PageSizeOpts extends Selectable {
  resetOffset?: boolean;
}

export const META: TagMeta = {
  types: {
    resetOffset: 'boolean'
  }
};
export const DEFAULT_PAGE_SIZES = [10, 25, 50, 100];

@meta(META)
export class PageSize extends SelectTag<PageSizeOpts> {
  resetOffset: boolean;

  init() {
    this.expose('selectable');
  }

  setDefaults() {
    this.items = this.config.pageSizes || DEFAULT_PAGE_SIZES;
  }

  onSelect(value: number) {
    return this.flux.resize(value, this.resetOffset)
      .then(() => this.services.tracker && this.services.tracker.search());
  }
}
