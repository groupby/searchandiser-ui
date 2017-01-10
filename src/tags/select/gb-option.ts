import { FluxTag } from '../tag';
import { Select } from './gb-select';

export interface Option extends FluxTag<any> {
  $select: Select;
  $item: any;
}

export class Option {

  label: string;
  value: string;

  init() {
    if (this.$item.clear) {
      this.root.classList.add('clear');
    }

    this.label = this.$select.itemLabel(this.$item);
    this.value = this.$select.itemValue(this.$item);
  }

  onSelect() {
    if (this.$item.clear) {
      this.$select.clearSelection();
    } else {
      this.$select.selectCustom(<any>this);
    }
  }
}
