import { FluxTag } from '../tag';

export interface Reset extends FluxTag { }

export class Reset {

  searchBox: HTMLInputElement;

  init() {
    this.on('mount', () => this.searchBox = (<HTMLInputElement>document.querySelector('[riot-tag="gb-raw-query"]')))
    this.root.addEventListener('click', this.clearQuery);
  }

  clearQuery() {
    this.opts.flux.reset(this.searchBox.value = '');
  }
}
