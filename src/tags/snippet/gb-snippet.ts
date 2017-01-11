import { checkBooleanAttr } from '../../utils/common';
import { FluxTag } from '../tag';

export interface SnippetConfig {
  raw?: boolean;
  url: string;
}

export class Snippet extends FluxTag<any> {

  raw: boolean;
  url: string;

  responseText: string;

  init() {
    this.raw = checkBooleanAttr('raw', this.opts);
    this.url = this.opts.url;

    this.on('mount', this.loadFile);
  }

  loadFile() {
    return new Promise((resolve) => {
      const req = new XMLHttpRequest();
      req.onload = () => {
        const { responseText } = req;
        if (this.raw) {
          this.root.innerHTML = responseText;
        } else {
          this.update({ responseText });
        }
        resolve(responseText);
      };
      req.open('get', this.url, true);
      req.send();
    });
  }
}
