import { FluxTag } from '../tag';
import { List, Listable } from './gb-list';

export class ListItem extends FluxTag<any> {
  $listable: Listable;
  $list: List;
  item: any;
  i: number;

  init() {
    this.expose(this.$listable.itemAlias, this.item);
    this.expose(this.$listable.indexAlias, this.i);
    if (this.$list.isActive(this.i)) {
      this.root.classList.add('active');
    }
    this.unexpose('list');
  }
}
