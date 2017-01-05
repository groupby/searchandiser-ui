import { FluxTag } from '../tag';

export interface ListItem extends FluxTag<any> { }

export class ListItem {

  item: any;

  init() {
    console.log(this.opts);
    this.alias(this.opts.itemAlias, this.item);
  }
}
