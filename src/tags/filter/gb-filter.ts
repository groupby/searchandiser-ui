import { FILTER_UPDATED_EVENT } from '../../services/filter';
import { getPath, toRefinement } from '../../utils/common';
import { SelectTag } from '../select/gb-select';
import { Results } from 'groupby-api';

export interface Filter extends SelectTag { }

export class Filter {

  _config: FilterConfig;
  selected: any;

  init() {
    this._config = getPath(this.config, 'tags.filter') || this.opts;
    this.label = this._config.label || 'Filter';
    this.clear = this._config.clear || 'Unfiltered';

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

export interface FilterConfig {
  field: string;
  label?: string;
  clear?: string;
}
