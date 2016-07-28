import { FluxTag } from '../tag';
import { Events } from 'groupby-api';
import { getParam, getPath } from '../../utils';

export interface Details extends FluxTag { }

export class Details {

  getPath: typeof getPath;
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
