import { FILTER_UPDATED_EVENT } from '../../services/filter';
import { toRefinement } from '../../utils/common';
import { Select, Selectable, SelectTag } from '../select/gb-select';
import { TagConfigure } from '../tag';
import { Results } from 'groupby-api';

export interface FilterConfig extends Selectable {
  field: string;
}

export const DEFAULTS = {
  label: 'Filter',
  clear: 'Unfiltered'
};

export class Filter extends SelectTag<any> {
  tags: { 'gb-select': Select };

  field: string;

  selected: any;

  init() {
    this.alias('selectable');

    this.flux.on(FILTER_UPDATED_EVENT, this.updateValues);
  }

  onConfigure(configure: TagConfigure) {
    configure({ defaults: DEFAULTS });
  }

  convertRefinements(navigations: any[]): any[] {
    const found = navigations.find(({ name }) => this.services.filter.isTargetNav(name));
    return found ? found.refinements.map((ref) => ({ label: ref.value, value: ref })) : [];
  }

  updateValues(res: Results) {
    this.update({ items: this.convertRefinements(res.availableNavigation) });
  }

  onSelect(value: any | '*') {
    if (this.selected) {
      this.flux.unrefine(this.selected, { skipSearch: true });
    }
    if (value === '*') {
      this.flux.reset();
    } else {
      this.flux.refine(this.selected = toRefinement(value, <any>{ name: this.field }));
    }
  }
}
