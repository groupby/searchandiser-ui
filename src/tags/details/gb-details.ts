import { getParam, getPath } from '../../utils';
import { FluxTag } from '../tag';
import { Events } from 'groupby-api';

export interface Details extends FluxTag { }

export class Details {

  idParam: string;
  query: string;
  record: any;
  getPath: typeof getPath;

  init() {
    this.idParam = this.opts.idParam || 'id';
    this.query = getParam(this.idParam);
    this.getPath = getPath;
    this.flux.on(Events.DETAILS, (record) => this.updateRecord(record));
    if (this.query) this.flux.details(this.query);
  }

  updateRecord(record: any) {
    this.update({ record });
  }
}
