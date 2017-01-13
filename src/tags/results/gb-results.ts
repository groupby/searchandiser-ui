import { checkBooleanAttr, getPath } from '../../utils/common';
import { ProductStructure } from '../../utils/product-transformer';
import { FluxTag } from '../tag';
import { Events, Record, Results as ResultsModel } from 'groupby-api';

export interface ResultsConfig {
  lazy?: boolean;
}

export class Results extends FluxTag<ResultsConfig> {
  lazy: boolean;

  structure: ProductStructure;
  variantStruct: ProductStructure;
  records: Record[];
  collection: string;

  init() {
    this.alias('productable');
    this.mixin({ getPath });

    this.lazy = checkBooleanAttr('lazy', this.opts);

    this.structure = this.config.structure;

    this.flux.on(Events.RESULTS, this.updateRecords);
  }

  updateRecords({ records }: ResultsModel) {
    this.update({ records, collection: this.flux.query.raw.collection });
  }

  userStyle(key: string) {
    return this.opts.css ? this.opts.css[key] : '';
  }
}
