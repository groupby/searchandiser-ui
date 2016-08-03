import { FluxTag } from '../tag';
import { unless } from '../../utils';

export interface Import extends FluxTag { }

export class Import {

  isRaw: boolean;
  responseText: string;

  init() {
    this.isRaw = unless(this.opts.raw, false);

    this.on('mount', this.loadFile);
  }

  loadFile() {
    const req = new XMLHttpRequest();
    req.onload = () => {
      const { responseText } = req;
      if (this.isRaw) {
        this.root.innerHTML = responseText;
      } else {
        this.update({ responseText });
      }
    };
    req.open('get', this.opts.url, true);
    req.send();
  }
}
