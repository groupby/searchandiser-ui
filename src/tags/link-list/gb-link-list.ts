import { Listable } from '../list/gb-list';
import { FluxTag } from '../tag';

export interface Linkable extends Listable {
  onSelect(obj: any): void;
}

export interface LinkTag<T> extends Linkable { }

export class LinkTag<T> extends FluxTag<T> { }

export class LinkList extends FluxTag<any> {
  $linkable: Linkable;
  $listable: Listable;

  init() {
    this.expose('listable', this.linkable());

    this.on('update', this.updateListable);
  }

  updateListable() {
    this.linkable(this.$listable);
  }

  linkable(obj: any = {}) {
    return Object.assign(obj, this.$linkable, this.opts);
  }
}
