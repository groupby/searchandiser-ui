import { FluxTag } from '../tag';
import { Select } from './gb-select';

export interface Option extends FluxTag<any> {
  $select: Select;
  $option: any;
}

export class Option {

  label: string;
  value: string;

  init() {
    this.label = this.$select.optionLabel(this.$option);
    this.value = this.$select.optionValue(this.$option);
  }

  onSelect() {
    if (this.$option.clear) {
      this.$select.clearSelection();
    } else {
      this.$select.selectCustom(<any>this);
    }
  }
}
