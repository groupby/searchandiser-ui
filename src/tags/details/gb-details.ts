import { FluxTag } from '../tag';
import { Events } from 'groupby-api';
import { getParam, getPath } from '../../utils';

export interface Details extends FluxTag { }

export class Details {

  idParam: string;
  query: string;
  struct: any;
  record: any;
  getPath: typeof getPath;

  init() {
    this.idParam = this.opts.idParam || 'id';
    this.query = getParam(this.idParam);
    this.getPath = getPath;
    this.struct = this.opts.config.structure;
    this.flux.on(Events.DETAILS, (record) => this.updateRecord(record));
    if (this.query) this.flux.details(this.query);
  }

  updateRecord(record) {
    this.update({ record });
  }
}
