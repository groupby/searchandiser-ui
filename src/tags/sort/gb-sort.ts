import { FluxTag } from '../tag';
import { checkNested } from '../../utils';
import { SelectConfig } from '../select/gb-select';

export interface Sort extends FluxTag { }

export class Sort {

  parentOpts: any;
  options: any;
  passthrough: SelectConfig;

  init() {
    this.parentOpts = this.opts.passthrough || this.opts;
    this.options = checkNested(this.parentOpts.config, 'tags', 'sort', 'options') ? this.parentOpts.config.tags.sort.options
      : this.parentOpts.options
      || [
        { label: 'Name Descending', value: { field: 'title', order: 'Descending' } },
        { label: 'Name Ascending', value: { field: 'title', order: 'Ascending' } }
      ];

    this.passthrough = Object.assign({}, this.parentOpts.__proto__, {
      options: this.options,
      update: this.sort,
      hover: this.parentOpts.onHover,
      default: true
    });
  }

  sortValues() {
    return this.options.map(option => option.value);
  }

  sort(value) {
    return this.parentOpts.flux.sort(value, this.sortValues())
  }
}
