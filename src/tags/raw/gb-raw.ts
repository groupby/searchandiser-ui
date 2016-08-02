import { FluxTag } from '../tag';

export interface Raw extends FluxTag { }

export class Raw {
  init() {
    this.on('update', () => this.updateContent());
    this.updateContent();
  }

  updateContent() {
    this.root.innerHTML = this.opts.content;
  }
}
