import { getParam, getPath } from '../../utils/common';
import { ProductMeta, ProductTransformer } from '../../utils/product-transformer';
import { FluxTag } from '../tag';
import * as clone from 'clone';
import { Events, Record } from 'groupby-api';

export interface Details extends FluxTag { }

export class Details {

  idParam: string;
  query: string;
  struct: any;
  allMeta: any;
  transformer: ProductTransformer;
  productMeta: ProductMeta;
  getPath: typeof getPath;

  init() {
    this.idParam = this.opts.idParam || 'id';
    this.query = getParam(this.idParam);
    this.struct = this.config.structure;
    this.transformer = new ProductTransformer(this.struct);
    this.getPath = getPath;

    this.flux.on(Events.DETAILS, this.updateRecord);
    if (this.query) this.flux.details(this.query);
  }

  updateRecord({ allMeta: originalAllMeta }: Record) {
    const productMeta = this.transformer.transform(clone(originalAllMeta, false));
    this.update({ productMeta, allMeta: productMeta() });
  }
}
