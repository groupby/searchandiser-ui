import { FluxTag } from '../tag';

export class Raw extends FluxTag<any> {

  init() {
    this.on('update', this.updateContent);
    this.on('mount', this.updateContent);
  }

  updateContent() {
    this.root.innerHTML = this.opts.content;
  }
}
