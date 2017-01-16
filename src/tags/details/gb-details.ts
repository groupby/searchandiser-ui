import { getParam } from '../../utils/common';
import { ProductTransformer } from '../../utils/product-transformer';
import { FluxTag, TagConfigure } from '../tag';
import * as clone from 'clone';
import { Events, Record } from 'groupby-api';

export interface DetailsConfig {
  idParam: string;
}

export const DEFAULTS = {
  idParam: 'id'
};

export class Details extends FluxTag<any> {
  idParam: string;

  structure: any;
  transformer: ProductTransformer;
  metadata: any;
  variants: any[];

  init() {
    this.alias('product');

    this.flux.on(Events.DETAILS, this.updateRecord);
  }

  onConfigure(configure: TagConfigure) {
    const config = configure({ defaults: DEFAULTS });

    this.structure = config.structure || this.config.structure || {};
    this.transformer = new ProductTransformer(this.structure);

    this.requestDetails();
  }

  requestDetails() {
    const query = getParam(this.idParam);
    if (query) {
      this.flux.details(query, this.transformer.idField);
    }
  }

  updateRecord({ allMeta }: Record) {
    const variants = this.transformer.transform(clone(allMeta, false));
    this.update({ variants, metadata: variants[0] });
  }
}
