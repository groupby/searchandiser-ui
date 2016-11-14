import { findSearchBox } from '../../utils/common';
import { FluxTag } from '../tag';

export interface Reset extends FluxTag<any> { }

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
    return this.flux.reset(this.searchBox.value = '')
      .then(() => this.services.tracker && this.services.tracker.search());
  }
}
