import { FluxTag } from '../tag';

export interface RawOpts {
  content: string;
}

export class Raw extends FluxTag<RawOpts> {

  init() {
    this.on('update', this.updateContent);
    this.on('mount', this.updateContent);
  }

  updateContent() {
    this.root.innerHTML = this.opts.content;
  }
}
