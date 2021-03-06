import { getParam } from '../../utils/common';
import { meta } from '../../utils/decorators';
import { ProductStructure, ProductTransformer } from '../../utils/product-transformer';
import { Product } from '../product/gb-product';
import { FluxTag, TagMeta } from '../tag';
import { Events, Record } from 'groupby-api';

export interface DetailsOpts {
  idParam: string;
  structure?: ProductStructure;
}

export const META: TagMeta = {
  defaults: { idParam: 'id' }
};

@meta(META)
export class Details extends FluxTag<DetailsOpts> {

  tags: { 'gb-product': Product };

  idParam: string;

  structure: ProductStructure;
  transformer: ProductTransformer;
  allMeta: any;

  init() {
    this.flux.on(Events.DETAILS, this.updateRecord);
  }

  setDefaults(config: DetailsOpts) {
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
