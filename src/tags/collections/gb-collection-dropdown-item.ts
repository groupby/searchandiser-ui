import { FluxTag } from '../tag';

export interface CollectionDropdownItem extends FluxTag<any> {
  option: any;
}

export class CollectionDropdownItem {

  selectDropdown() {
    if (typeof this.option === 'object') {
      this._scope.selectCustom(this.option);
    } else {
      this._scope.selectCustom({
        label: this.option,
        value: this.option
      });
    }
  }
}
