import { FILTER_UPDATED_EVENT } from '../../services/filter';
import { toRefinement } from '../../utils/common';
import { Select, Selectable } from '../select/gb-select';
import { FluxTag } from '../tag';
import { Results } from 'groupby-api';

export interface FilterConfig extends Selectable {
  field: string;
}

export const DEFAULT_CONFIG: FilterConfig = {
  field: undefined,
  label: 'Filter',
  clear: 'Unfiltered'
};

export interface Filter extends FluxTag<any>, Selectable {
  tags: {
    'gb-select': Select<FilterConfig>;
  };
}

export class Filter {
  field: string;

  _config: FilterConfig;
  selected: any;

  init() {
    this.field = this.opts.field;
    this.label = this.opts.label || 'Filter';
    this.clear = this.opts.clear || 'Unfiltered';

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
