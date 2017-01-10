import { FluxTag } from '../tag';
import { Collections } from './gb-collections';

export interface CollectionItem extends FluxTag<any> {
  $collections: Collections;
  $item: any;
}

export class CollectionItem {

  label() {
    if (typeof this.$item === 'string') {
      return this.$collections.labels[this.$item];
    } else {
      return this.$item;
    }
  }
}
