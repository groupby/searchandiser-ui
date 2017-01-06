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
    // this is the shitty part...
    // re-alias $linkable as $listable
    this.alias('listable', this.linkable());

    // every time $linkable updates, update $listable
    this.on('update', this.updateListable);
    // can't do this or it won't know 'items' has changed
    // this.on('update', () => this.$listable = this.linkable());
  }

  updateListable() {
    this.linkable(this.$listable);
  }

  linkable(obj: any = {}) {
    // mix onto empty object
    return Object.assign(obj, this.$linkable, this.opts);
  }
}
