import { FluxTag } from '../tag';
import { Events } from 'groupby-api';
import { getPath } from '../../utils'

export interface Results extends FluxTag { }

export class Results {

  parent: Riot.Tag.Instance & { struct: any };
  struct: any;
  getPath: typeof getPath;

  init() {
    this.struct = this.parent ? this.parent.struct : this.opts.config.structure;
    this.getPath = getPath;
    this.opts.flux.on(Events.RESULTS, ({ records }) => this.update({ records }));
  }

  userStyle(key: string) {
    return this.opts.css ? this.opts.css[key] : '';
  }
}
