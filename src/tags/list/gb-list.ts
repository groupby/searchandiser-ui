import { checkBooleanAttr } from '../../utils/common';
import { FluxTag } from '../tag';

export interface Listable {
  items: any[];
  itemAlias?: string;
  indexAlias?: string;
  inline?: boolean;
  activation?: (index: number) => boolean;
}

export interface List extends FluxTag<any> {
  $listable: Listable;
}

export class List {

  itemAlias: string;
  indexAlias: string;
  inline: boolean;

  init() {
    this.alias('list');

    const listable = this.listable();
    this.inline = checkBooleanAttr('inline', listable);
    this.itemAlias = listable.itemAlias || 'item';
    this.indexAlias = listable.indexAlias || 'i';
  }

  isActive(index: number) {
    const listable = this.listable();
    return listable.activation && listable.activation(index);
  }

  listable() {
    return Object.assign({}, this.$listable, this.opts);
  }
}
