import { Selectable, SelectTag } from '../select/gb-select';
import { TagConfigure } from '../tag';
import { Results, Sort as SortModel } from 'groupby-api';

export interface SortConfig extends Selectable { }

export const DEFAULTS = {
  items: [
    { label: 'Name Descending', value: { field: 'title', order: 'Descending' } },
    { label: 'Name Ascending', value: { field: 'title', order: 'Ascending' } }
  ]
};

export class Sort extends SelectTag<any> {

  init() {
    this.expose('selectable');
  }

  onConfigure(configure: TagConfigure) {
    configure({ defaults: DEFAULTS });
  }

  sortValues() {
    return this.items.map((item) => item.value);
  }

  onSelect(value: SortModel): Promise<Results> {
    return this.flux.sort(value, this.sortValues());
  }
}
