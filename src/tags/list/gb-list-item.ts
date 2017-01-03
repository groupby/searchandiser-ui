import { FluxTag } from '../tag';

export interface ListItem extends FluxTag<any> {
  refs: {
    listItem: HTMLLIElement;
  };
  index: number;
}

export class ListItem {

  onMount() {
    if (this.$computed.activation && this.$computed.activation(this.index)) {
      this.refs.listItem.classList.add('active');
    }
  }
}
