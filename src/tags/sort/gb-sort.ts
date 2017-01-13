import { Selectable, SelectTag } from '../select/gb-select';
import { Results, Sort as SortModel } from 'groupby-api';

export const DEFAULT_SORTS = [
  { label: 'Name Descending', value: { field: 'title', order: 'Descending' } },
  { label: 'Name Ascending', value: { field: 'title', order: 'Ascending' } }
];

export interface SortConfig extends Selectable { }

export class Sort extends SelectTag<any> {

  init() {
    this.alias('selectable');

    this.items = this.opts.items || DEFAULT_SORTS;
  }

  sortValues() {
    return this.items.map((item) => item.value);
  }

  onSelect(value: SortModel): Promise<Results> {
    return this.flux.sort(value, this.sortValues());
  }
}
