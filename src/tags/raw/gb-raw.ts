import { FluxTag } from '../tag';

export interface Raw extends FluxTag<any> { }

export class Raw {

  init() {
    this.on('update', this.updateContent);
    this.on('mount', this.updateContent);
  }

  updateContent() {
    this.root.innerHTML = this.opts.content;
  }
}
