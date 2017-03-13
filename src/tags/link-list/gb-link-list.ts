import { Listable, ListTag } from '../list/gb-list';
import { FluxTag } from '../tag';

export interface Linkable extends Listable {
  onSelect(obj: any): void;
}

export interface LinkTag<T extends Linkable> extends Linkable { }

export class LinkTag<T extends Linkable> extends ListTag<T> { }

export class LinkList extends FluxTag<any> {

  init() {
    this.transform('linkable', ['listable']);
  }
}
