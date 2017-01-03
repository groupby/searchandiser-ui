import { SelectConfig, SelectTag } from '../select/gb-select';
import { Results, Sort as SortModel } from 'groupby-api';

export const DEFAULT_SORTS = [
  { label: 'Name Descending', value: { field: 'title', order: 'Descending' } },
  { label: 'Name Ascending', value: { field: 'title', order: 'Ascending' } }
];

export interface SortConfig extends SelectConfig {
  options: any[];
}

export interface Sort extends SelectTag<SortConfig> { }

export class Sort {

  init() {
    this.configure();

    this.options = this.$config.options || DEFAULT_SORTS;
  }

  sortValues() {
    return this.options.map((option) => option.value);
  }

  onselect(value: SortModel): Promise<Results> {
    return this.flux.sort(value, this.sortValues());
  }
}
