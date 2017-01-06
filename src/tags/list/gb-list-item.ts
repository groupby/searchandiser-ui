import { FluxTag } from '../tag';
import { List } from './gb-list';

export interface ListItem extends FluxTag<any> {
  $list: List;
  item: any;
  i: number;
}

export class ListItem {

  init() {
    this.alias(this.$list.itemAlias, this.item);
    this.alias(this.$list.indexAlias, this.i);
    if (this.$list.isActive(this.i)) {
      this.root.classList.add('active');
    }
    this.unalias('list');
  }
}
