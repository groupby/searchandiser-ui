import { FILTER_UPDATED_EVENT } from '../../services/filter';
import { toRefinement } from '../../utils/common';
import { Select, SelectConfig, SelectTag } from '../select/gb-select';
import { Results } from 'groupby-api';

export interface FilterConfig extends SelectConfig {
  field: string;
}

export const DEFAULT_CONFIG: FilterConfig = {
  field: undefined,
  label: 'Filter',
  clear: 'Unfiltered'
};

export interface Filter extends SelectTag<FilterConfig> {
  tags: {
    'gb-select': Select<FilterConfig>;
  };
}

export class Filter {

  _config: FilterConfig;
  selected: any;

  init() {
    this.configure(DEFAULT_CONFIG);

    this.flux.on(FILTER_UPDATED_EVENT, this.updateValues);
  }

  convertRefinements(navigations: any[]): any[] {
    const found = navigations.find(({ name }) => this.services.filter.isTargetNav(name));
    return found ? found.refinements.map((ref) => ({ label: ref.value, value: ref })) : [];
  }

  updateValues(res: Results) {
    const converted = this.convertRefinements(res.availableNavigation);
    if (this.tags['gb-select']) {
      this.tags['gb-select'].updateOptions(converted);
    } else {
      this.update({ options: converted });
    }
  }

  onselect(value: any | '*') {
    if (this.selected) this.flux.unrefine(this.selected, { skipSearch: true });
    if (value === '*') {
      this.flux.reset();
    } else {
      this.flux.refine(this.selected = toRefinement(value, <any>{ name: this._config.field }));
    }
  }
}
