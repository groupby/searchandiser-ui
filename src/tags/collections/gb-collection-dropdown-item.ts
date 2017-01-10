import { Select } from '../select/gb-select';
import { FluxTag } from '../tag';

export interface CollectionDropdownItem extends FluxTag<any> {
  $select: Select;
  $item: any;
}

export class CollectionDropdownItem {

  selectDropdown() {
    if (typeof this.$item === 'object') {
      this.$select.selectCustom(this.$item);
    } else {
      this.$select.selectCustom({ label: this.$item, value: this.$item });
    }
  }
}
