import { Events } from 'groupby-api';
import { getParam, getPath } from '../../utils';

export class Details {

  opts: any;
  update: (any) => void;
  getPath: (any, string) => any;

  struct: any;

  init() {
    const idParam = this.opts.idParam || 'id';
    const query = getParam(idParam);


    this.getPath = getPath;
    this.struct = this.opts.config.structure;
    this.opts.flux.on(Events.DETAILS, (record) => this.update({ record }));
    if (query) this.opts.flux.details(query);
  }

}
