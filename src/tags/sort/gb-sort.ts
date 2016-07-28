import { FluxTag } from '../tag';
import { checkNested } from '../../utils';

export interface Sort extends FluxTag { }

export class Sort {

  parentOpts: any;
  options: any;
  passthrough: any;

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
      update: this.updateValues,
      hover: this.parentOpts.onHover,
      default: true
    });
  }

  private sortValues() {
    return this.options.map(option => option.value);
  }

  updateValues(value) {
    return this.parentOpts.flux.sort(value, this.sortValues())
  }
}
