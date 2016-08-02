import { FluxTag } from '../tag';
import { unless } from '../../utils';

export interface Import extends FluxTag { }

export class Import {
  init() {
    const isRaw = unless(this.opts.raw, false);
    const loadFile = () => {
      const req = new XMLHttpRequest();
      req.onload = () => {
        const { responseText } = req;
        if (isRaw) {
          this.root.innerHTML = responseText;
        } else {
          this.update({ responseText });
        }
      };
      req.open('get', this.opts.url, true);
      req.send();
    };

    this.on('mount', () => loadFile());
  }
}
