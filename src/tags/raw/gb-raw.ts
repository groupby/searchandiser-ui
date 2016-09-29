import { FluxTag } from '../tag';

export interface RawConfig {
  content: string;
}

export interface Raw extends FluxTag<RawConfig> { }

export class Raw {

  init() {
    this.configure();

    this.on('update', this.updateContent);
    this.on('mount', this.updateContent);
  }

  updateContent() {
    this.root.innerHTML = this._config.content;
  }
}
