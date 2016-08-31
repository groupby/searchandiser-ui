import { getPath, unless } from '../../utils';
import { SelectTag } from '../select/gb-select';
import { Results, Sort as SortModel } from 'groupby-api';

export interface Sort extends SelectTag { }

export class Sort {

  init() {
    this.options = unless(getPath(this.config, 'tags.sort.options'), this.opts.options, [
      { label: 'Name Descending', value: { field: 'title', order: 'Descending' } },
      { label: 'Name Ascending', value: { field: 'title', order: 'Ascending' } }
    ]);
  }

  sortValues() {
    return this.options.map((option) => option.value);
  }

  onselect(value: SortModel): Promise<Results> {
    return this.flux.sort(value, this.sortValues());
  }
}
