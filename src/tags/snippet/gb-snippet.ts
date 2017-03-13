import { meta } from '../../utils/decorators';
import { FluxTag, TagMeta } from '../tag';

export interface SnippetOpts {
  raw?: boolean;
  url: string;
}

export const META: TagMeta = {
  types: {
    raw: 'boolean'
  }
};

@meta(META)
export class Snippet extends FluxTag<SnippetOpts> {

  raw: boolean;
  url: string;

  responseText: string;

  init() {
    this.on('mount', this.loadFile);
  }

  loadFile() {
    return new Promise((resolve) => {
      const req = new XMLHttpRequest();
      req.onerror = (err) => console.error(`unable to load ${this.url}`, err);
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
