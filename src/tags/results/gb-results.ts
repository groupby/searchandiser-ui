import { meta } from '../../utils/decorators';
import { ProductStructure } from '../../utils/product-transformer';
import { FluxTag, TagMeta } from '../tag';
import { Events, Record, Results as ResultsModel } from 'groupby-api';

export interface ResultsOptions {
  lazy?: boolean;
  css?: { [key: string]: string };
  structure?: ProductStructure;
}

export const META: TagMeta = {
  types: {
    lazy: 'boolean'
  }
};

@meta(META)
export class Results extends FluxTag<ResultsOptions> {

  lazy: boolean;

  structure: ProductStructure;
  variantStruct: ProductStructure;
  records: Record[];
  collection: string;

  init() {
    this.expose('productable');

    this.flux.on(Events.RESULTS, this.updateRecords);
  }

  setDefaults(config: ResultsOptions) {
    this.structure = config.structure || this.config.structure;
  }

  updateRecords({ records }: ResultsModel) {
    this.update({ records, collection: this.flux.query.raw.collection });
  }

  userStyle(key: string) {
    return this.opts.css ? this.opts.css[key] : '';
  }
}
