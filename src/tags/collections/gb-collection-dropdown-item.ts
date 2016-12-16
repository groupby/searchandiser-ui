import { FluxTag } from '../tag';

export interface CollectionDropdownItem extends FluxTag<any> {
  _parent: FluxTag<any> & { option: any; };
}

export class CollectionDropdownItem {

  selectDropdown() {
    if (typeof this._parent.option === 'object') {
      this.$scope.selectCustom(this._parent.option);
    } else {
      this.$scope.selectCustom({
        label: this._parent.option,
        value: this._parent.option
      });
    }
  }
}
