import { FluxTag } from '../tag';
import { List } from './gb-list';

export interface ListItem extends FluxTag<any> {
  $list: List;
}

export class ListItem {

  item: any;
  i: number;

  init() {
    console.log(this);
    this.alias(this.$list.itemAlias, this.item);
    this.alias(this.$list.indexAlias, this.i);
    if (this.$list.isActive(this.i)) {
      this.root.classList.add('active');
    }
  }
}
