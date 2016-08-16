import { FluxTag } from '../tag';
import { Events, Record } from 'groupby-api';
import { getPath, unless } from '../../utils';
import { ProductStructure } from '../../searchandiser';

export interface Results extends FluxTag {
  parent: Riot.Tag.Instance;
}

export class Results {

  struct: ProductStructure;
  variantStruct: ProductStructure;
  records: Record[];
  getPath: typeof getPath;

  init() {
    this.struct = this.config.structure;
    this.variantStruct = unless(this.struct._variantStructure, this.struct);
    this.getPath = getPath;
    this.flux.on(Events.RESULTS, ({ records }) => this.updateRecords(records));
  }

  updateRecords(records) {
    this.update({ records });
  }

  userStyle(key: string) {
    return this.opts.css ? this.opts.css[key] : '';
  }
}
