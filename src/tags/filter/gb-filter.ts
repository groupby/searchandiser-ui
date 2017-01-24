import { FILTER_UPDATED_EVENT } from '../../services/filter';
import { toRefinement } from '../../utils/common';
import { meta } from '../../utils/decorators';
import { Selectable, SelectTag } from '../select/gb-select';
import { TagMeta } from '../tag';
import { Results } from 'groupby-api';

export interface FilterOpts extends Selectable {
  field: string;
}

export const META: TagMeta = {
  defaults: {
    label: 'Filter',
    clear: 'Unfiltered'
  }
};

@meta(META)
export class Filter extends SelectTag<FilterOpts> {
  field: string;

  selected: any;

  init() {
    this.expose('selectable');

    this.flux.on(FILTER_UPDATED_EVENT, this.updateValues);
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
