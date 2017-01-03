import { checkBooleanAttr } from '../../utils/common';
import { FluxTag } from '../tag';

export interface List extends FluxTag<any> {
  refs: {
    list: HTMLUListElement;
  };
  index: number;
}

export const SCHEMA = {
  activation: { for: 'gb-list-item' }
};

export class List {

  init() {
    this.$schema(SCHEMA);
  }

  onMount() {
    if (checkBooleanAttr('inline', this.opts)) {
      this.refs.list.classList.add('inline');
    }
  }
}
