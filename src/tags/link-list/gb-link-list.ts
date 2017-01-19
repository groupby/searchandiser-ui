import { Listable } from '../list/gb-list';
import { FluxTag } from '../tag';

export interface Linkable extends Listable {
  onSelect(obj: any): void;
}

export interface LinkTag<T> extends Linkable { }

export class LinkTag<T> extends FluxTag<T> { }

export class LinkList extends FluxTag<any> {

  init() {
    this.transform('linkable', ['listable']);
  }
}
