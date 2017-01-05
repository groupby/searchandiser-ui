import { checkBooleanAttr } from '../../utils/common';
import { FluxTag } from '../tag';

export interface ListConfig {
  itemAlias?: string;
  inline?: boolean;
  activation?: (index: number) => boolean;
}

export interface List extends FluxTag<any> { }

export class List {

  itemAlias: string;
  inline: boolean;

  init() {
    this.itemAlias = this.opts.itemAlias || 'item';
    console.log(this);
    this.inline = checkBooleanAttr(this.opts, 'inline');
  }

  isActive(index: number) {
    return this.opts.activation && this.opts.activation(index);
  }
}
