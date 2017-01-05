import { checkBooleanAttr } from '../../utils/common';
import { FluxTag } from '../tag';

export interface ListConfig {
  itemAlias?: string;
  indexAlias?: string;
  inline?: boolean;
  activation?: (index: number) => boolean;
}

export interface List extends FluxTag<any> { }

export class List {

  itemAlias: string;
  indexAlias: string;
  inline: boolean;

  init() {
    this.inline = checkBooleanAttr('inline', this.opts);
    this.itemAlias = this.opts.itemAlias || 'item';
    this.indexAlias = this.opts.indexAlias || 'i';
    this.alias('list');
  }

  isActive(index: number) {
    return this.opts.activation && this.opts.activation(index);
  }
}
