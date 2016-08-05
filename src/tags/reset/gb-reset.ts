import { FluxTag } from '../tag';
import { findTag } from '../../utils';

export interface Reset extends FluxTag { }

export class Reset {

  searchBox: HTMLInputElement;

  init() {
    this.on('mount', this.findSearchBox);
    this.root.addEventListener('click', this.clearQuery);
  }

  findSearchBox() {
    this.searchBox = <HTMLInputElement>findTag('gb-raw-query')
  }

  clearQuery() {
    this.flux.reset(this.searchBox.value = '');
  }
}
