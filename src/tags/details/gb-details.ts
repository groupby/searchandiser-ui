import { getParam } from '../../utils/common';
import { ProductTransformer } from '../../utils/product-transformer';
import { Product } from '../product/gb-product';
import { FluxTag, TagConfigure } from '../tag';
import { Events, Record } from 'groupby-api';

export interface DetailsOpts {
  idParam: string;
}

export const DEFAULTS = {
  idParam: 'id'
};

export class Details extends FluxTag<DetailsOpts> {
  tags: { 'gb-product': Product };

  idParam: string;

  structure: any;
  transformer: ProductTransformer;
  allMeta: any;

  init() {
    this.flux.on(Events.DETAILS, this.updateRecord);
  }

  onConfigure(configure: TagConfigure) {
    const config = configure({ defaults: DEFAULTS });

    this.structure = config.structure || this.config.structure;
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
    this.tags['gb-product'].updateRecord(allMeta);
    this.tags['gb-product'].update();
  }
}
