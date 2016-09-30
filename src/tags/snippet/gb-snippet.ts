import { FluxTag } from '../tag';

export interface SnippetConfig {
  raw?: boolean;
}

export const DEFAULT_CONFIG: SnippetConfig = {
  raw: false
};

export interface Snippet extends FluxTag<SnippetConfig> { }

export class Snippet {

  responseText: string;

  init() {
    this.configure(DEFAULT_CONFIG);

    this.on('mount', this.loadFile);
  }

  loadFile() {
    const req = new XMLHttpRequest();
    req.onload = () => {
      const { responseText } = req;
      if (this._config.raw) {
        this.root.innerHTML = responseText;
      } else {
        this.update({ responseText });
      }
    };
    req.open('get', this.opts.url, true);
    req.send();
  }
}
