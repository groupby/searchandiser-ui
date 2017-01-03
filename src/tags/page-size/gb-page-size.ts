import { SelectConfig, SelectTag } from '../select/gb-select';

export interface PageSizeConfig extends SelectConfig {
  resetOffset?: boolean;
}

export const DEFAULT_CONFIG = {
  resetOffset: false
};

export interface PageSize extends SelectTag<PageSizeConfig> { }

export class PageSize {

  init() {
    this.configure(DEFAULT_CONFIG);

    this.options = this.config.pageSizes || [10, 25, 50, 100];
  }

  onselect(value: number) {
    return this.flux.resize(value, this.$config.resetOffset)
      .then(() => this.services.tracker && this.services.tracker.search());
  }
}
