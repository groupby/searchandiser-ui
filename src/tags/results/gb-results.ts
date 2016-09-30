import { ProductStructure } from '../../searchandiser';
import { getPath, unless } from '../../utils/common';
import { FluxTag } from '../tag';
import { Events, Record } from 'groupby-api';

export interface Results extends FluxTag {
  parent: Riot.Tag.Instance;
}

export class Results {

  struct: ProductStructure;
  variantStruct: ProductStructure;
  records: Record[];
  collection: string;
  getPath: typeof getPath;

  init() {
    this.struct = this.config.structure;
    this.variantStruct = unless(this.struct._variantStructure, this.struct);
    this.getPath = getPath;
    this.flux.on(Events.RESULTS, ({ records }) => this.updateRecords(records));
  }

  updateRecords(records: Record[]) {
    this.update({ records, collection: this.flux.query.raw.collection });
  }

  userStyle(key: string) {
    return this.opts.css ? this.opts.css[key] : '';
  }
}
