import { FluxTag } from '../tag';

export interface SnippetConfig {
  raw?: boolean;
  url: string;
}

export const DEFAULT_CONFIG: SnippetConfig & any = {
  raw: false
};

export interface Snippet extends FluxTag<SnippetConfig> { }

export class Snippet {

  responseText: string;

  init() {
    this.configure(DEFAULT_CONFIG);
  }

  onMount() {
    const req = new XMLHttpRequest();
    req.onload = () => {
      const { responseText } = req;
      if (this.$config.raw) {
        this.root.innerHTML = responseText;
      } else {
        this.update({ responseText });
      }
    };
    req.open('get', this.$config.url, true);
    req.send();
  }
}
