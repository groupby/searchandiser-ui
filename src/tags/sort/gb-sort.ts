import { Results } from 'groupby-api';
import { FluxTag } from '../tag';
import { SelectTag } from '../select/gb-select';
import { checkNested, unless, getPath } from '../../utils';

export interface Sort extends SelectTag { }

export class Sort {

  init() {
    this.options = unless(getPath(this.config, 'tags.sort.options'), this.opts.options, [
      { label: 'Name Descending', value: { field: 'title', order: 'Descending' } },
      { label: 'Name Ascending', value: { field: 'title', order: 'Ascending' } }
    ]);
  }

  sortValues() {
    return this.options.map(option => option.value);
  }

  onselect(value) {
    return this.flux.sort(value, this.sortValues())
  }
}
