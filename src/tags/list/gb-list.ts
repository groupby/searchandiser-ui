import { FluxTag } from '../tag';

export interface Listable {
  items: any[];
  itemAlias?: string;
  indexAlias?: string;
  inline?: boolean;
  activation?: (index: number) => boolean;
  shouldRender?: (option: any) => boolean;
}

export const DEFAULTS = {
  itemAlias: 'item',
  indexAlias: 'i'
};
export const TYPES = {
  inline: 'boolean'
};

export class List extends FluxTag<any> {
  $listable: Listable;

  init() {
    this.expose('list');
    this.depend('listable', { defaults: DEFAULTS, types: TYPES });
  }

  isActive(index: number) {
    return this.$listable.activation && this.$listable.activation(index);
  }

  shouldRender(option: any) {
    return !this.$listable.shouldRender || this.$listable.shouldRender(option);
  }
}
