import { checkBooleanAttr } from '../../utils/common';
import { FluxTag } from '../tag';

export interface Listable {
  items: any[];
  itemAlias?: string;
  indexAlias?: string;
  inline?: boolean;
  activation?: (index: number) => boolean;
  shouldRender?: (option: any) => boolean;
}

export class List extends FluxTag<any> {
  $listable: Listable;

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

  shouldRender(option: any) {
    const listable = this.listable();
    return !listable.shouldRender || listable.shouldRender(option);
  }
}
