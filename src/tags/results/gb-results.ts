import { ProductStructure } from '../../utils/product-transformer';
import { FluxTag, TagConfigure } from '../tag';
import { Events, Record, Results as ResultsModel } from 'groupby-api';

export interface ResultsConfig {
  lazy?: boolean;
}

export const TYPES = {
  lazy: 'boolean'
};

export class Results extends FluxTag<ResultsConfig> {
  lazy: boolean;

  structure: ProductStructure;
  variantStruct: ProductStructure;
  records: Record[];
  collection: string;

  init() {
    this.expose('productable');

    this.flux.on(Events.RESULTS, this.updateRecords);
  }

  onConfigure(configure: TagConfigure) {
    const config = configure({ types: TYPES });

    this.structure = config.structure || this.config.structure;
  }

  updateRecords({ records }: ResultsModel) {
    this.update({ records, collection: this.flux.query.raw.collection });
  }

  userStyle(key: string) {
    return this.opts.css ? this.opts.css[key] : '';
  }
}
