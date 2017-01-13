import { Select } from '../select/gb-select';
import { FluxTag } from '../tag';

export class CollectionDropdownItem extends FluxTag<any> {
  $select: Select;
  $item: any;

  selectDropdown() {
    this.$select.selectCustom({
      label: this.$item.label || this.$item,
      value: this.$item.value || this.$item
    });
  }
}
