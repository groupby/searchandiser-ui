import { findSearchBox } from '../../utils/common';
import { FluxTag } from '../tag';

export interface Reset extends FluxTag { }

export class Reset {

  searchBox: HTMLInputElement;

  init() {
    this.on('mount', this.setSearchBox);
    this.root.addEventListener('click', this.clearQuery);
  }

  setSearchBox() {
    this.searchBox = findSearchBox();
  }

  clearQuery() {
    this.flux.reset(this.searchBox.value = '');
  }
}
