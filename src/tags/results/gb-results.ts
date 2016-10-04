import { getPath, unless } from '../../utils/common';
import { ProductStructure } from '../../utils/product-transformer';
import { FluxTag } from '../tag';
import { Events, Record, Results as ResultsModel } from 'groupby-api';

export interface Results extends FluxTag { }

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

    this.flux.on(Events.RESULTS, this.updateRecords);
  }

  updateRecords({ records }: ResultsModel) {
    this.update({ records, collection: this.flux.query.raw.collection });
  }

  userStyle(key: string) {
    return this.opts.css ? this.opts.css[key] : '';
  }
}
