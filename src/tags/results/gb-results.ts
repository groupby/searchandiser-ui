import { Events } from 'groupby-api';
import { getPath } from '../../utils'

export class Results {

  parent: any;
  opts: any;
  update: (any) => void;
  getPath: (any, string) => any;

  struct: any;

  init() {
    this.struct = this.parent ? this.parent.struct : this.opts.config.structure;
    this.getPath = getPath;
    this.opts.flux.on(Events.RESULTS, ({ records }) => this.update({ records }));
  }

  userStyle(key: string) {
    return this.opts.css ? this.opts.css[key] : '';
  }

}
