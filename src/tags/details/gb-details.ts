import { getParam } from '../../utils/common';
import { ProductMeta, ProductTransformer } from '../../utils/product-transformer';
import { FluxTag } from '../tag';
import * as clone from 'clone';
import { Events, Record } from 'groupby-api';

export interface DetailsConfig {
  idParam: string;
}

export const DEFAULT_CONFIG: DetailsConfig = {
  idParam: 'id'
};

export interface Details extends FluxTag<DetailsConfig> { }

export class Details {

  query: string;
  struct: any;
  allMeta: any;
  transformer: ProductTransformer;
  productMeta: ProductMeta;

  init() {
    this.configure(DEFAULT_CONFIG);
    this.query = getParam(this._config.idParam);
    this.struct = this.config.structure || {};
    this.transformer = new ProductTransformer(this.struct);

    this.flux.on(Events.DETAILS, this.updateRecord);
    if (this.query) this.flux.details(this.query, this.transformer.idField);
  }

  updateRecord({ allMeta }: Record) {
    const productMeta = this.transformer.transform(clone(allMeta, false));
    this.update({ productMeta, allMeta: productMeta() });
  }
}
