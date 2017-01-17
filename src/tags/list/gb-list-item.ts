import { FluxTag } from '../tag';
import { List } from './gb-list';

export class ListItem extends FluxTag<any> {
  $list: List;
  item: any;
  i: number;

  init() {
    this.expose(this.$list.itemAlias, this.item);
    this.expose(this.$list.indexAlias, this.i);
    if (this.$list.isActive(this.i)) {
      this.root.classList.add('active');
    }
    this.unexpose('list');
  }
}
