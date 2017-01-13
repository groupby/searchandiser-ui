import { getParam } from '../../utils/common';
import { ProductMeta, ProductTransformer } from '../../utils/product-transformer';
import { FluxTag } from '../tag';
import * as clone from 'clone';
import { Events, Record } from 'groupby-api';

export interface DetailsConfig {
  idParam: string;
}

export class Details extends FluxTag<any> {
  idParam: string;

  query: string;
  struct: any;
  allMeta: any;
  transformer: ProductTransformer;
  productMeta: ProductMeta;

  init() {
    this.idParam = this.opts.idParam || 'id';

    this.query = getParam(this.idParam);
    this.struct = this.config.structure || {};
    this.transformer = new ProductTransformer(this.struct);

    this.flux.on(Events.DETAILS, this.updateRecord);
    if (this.query) {
      this.flux.details(this.query, this.transformer.idField);
    }
  }

  updateRecord({ allMeta }: Record) {
    const variants = this.transformer.transform(clone(allMeta, false));
    this.update({ variants, metadata: variants[0] });
  }
}
