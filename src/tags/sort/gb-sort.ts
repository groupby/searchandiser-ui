import { getPath, unless } from '../../utils/common';
import { SelectTag } from '../select/gb-select';
import { Results, Sort as SortModel } from 'groupby-api';

export interface Sort extends SelectTag { }

export class Sort {

  _config: any;

  init() {
    this._config = getPath(this.config, 'tags.sort') || this.opts;
    this.options = unless(this._config.options, [
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
