import { Listable } from '../list/gb-list';
import { FluxTag } from '../tag';

export interface Linkable extends Listable {
  onSelect: () => void;
}

export interface LinkList extends FluxTag<any> {
  $linkable: Linkable;
  $listable: Listable;
}

export class LinkList {

  init() {
    this.alias('listable', this.linkable());

    this.on('update', this.updateListable);
  }

  updateListable() {
    this.linkable(this.$listable);
  }

  linkable(obj: any = {}) {
    return Object.assign(obj, this.$linkable, this.opts);
  }
}
