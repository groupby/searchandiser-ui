import { FluxTag } from '../tag';
import { List } from './gb-list';

export class ListItem extends FluxTag<any> {
  $list: List;
  item: any;
  i: number;

  init() {
    this.alias(this.$list.itemAlias, this.item);
    this.alias(this.$list.indexAlias, this.i);
    if (this.$list.isActive(this.i)) {
      this.root.classList.add('active');
    }
    this.unalias('list');
  }
}
