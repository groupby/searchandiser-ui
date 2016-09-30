import { SelectConfig, SelectTag } from '../select/gb-select';
import { Results, Sort as SortModel } from 'groupby-api';

export interface SortConfig extends SelectConfig { }

export interface Sort extends SelectTag<SortConfig> { }

export class Sort {

  _config: any;

  init() {
    this.configure();

    this.options = this._config.options || [
      { label: 'Name Descending', value: { field: 'title', order: 'Descending' } },
      { label: 'Name Ascending', value: { field: 'title', order: 'Ascending' } }
    ];
  }

  sortValues() {
    return this.options.map((option) => option.value);
  }

  onselect(value: SortModel): Promise<Results> {
    return this.flux.sort(value, this.sortValues());
  }
}
