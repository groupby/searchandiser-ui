import { FluxTag } from '../tag';
import { findTag } from '../../utils';

export interface Reset extends FluxTag { }

export class Reset {

  searchBox: HTMLInputElement;

  init() {
    this.on('mount', () => this.searchBox = <HTMLInputElement>findTag('gb-raw-query'));
    this.root.addEventListener('click', this.clearQuery);
  }

  clearQuery() {
    this.opts.flux.reset(this.searchBox.value = '');
  }
}
