import { checkBooleanAttr } from '../../utils/common';
import { ProductStructure, ProductTransformer } from '../../utils/product-transformer';
import { FluxTag } from '../tag';
import * as clone from 'clone';
import oget = require('oget');

export interface Productable {
  lazy?: boolean;
  infinite?: boolean;
  tombstone?: boolean;
  structure?: ProductStructure;
  allMeta: any;
}

export class Product extends FluxTag<any> {
  $productable: Productable;

  lazy: boolean;
  infinite: boolean;
  tombstone: boolean;

  variantIndex: number;
  detailsUrl: string;
  metadata: any;
  variants: any[];
  structure: ProductStructure;
  transformer: ProductTransformer;

  init() {
    this.alias('product');

    const productable = this.productable();
    this.lazy = checkBooleanAttr('lazy', productable, true);
    this.infinite = checkBooleanAttr('infinite', productable);
    this.tombstone = checkBooleanAttr('tombstone', productable);

    this.variantIndex = 0;
    this.detailsUrl = oget(this.services, 'url.urlConfig.detailsUrl', 'details.html');
    this.structure = Object.assign({}, this.config.structure, productable.structure);
    this.transformer = new ProductTransformer(this.structure);

    this.styleProduct();
    this.transformRecord(productable.allMeta);

    this.on('update', this.updateMetadata);
  }

  productable(obj: any = {}) {
    return Object.assign(obj, this.$productable, this.opts);
  }

  updateMetadata() {
    this.metadata = this.productable().allMeta;
  }

  styleProduct() {
    if (this.infinite) {
      this.root.classList.add('gb-infinite');
    }
    if (this.tombstone) {
      this.root.classList.add('tombstone');
    }
  }

  transformRecord(allMeta: any = {}) {
    const { variants, transformedMeta: metadata } = this.transformer.transform(clone(allMeta, false));
    this.update({ variants: variants || [], metadata });
  }

  link() {
    return this.metadata.url || `${this.detailsUrl}?id=${this.metadata.id}`;
  }

  imageLink() {
    const image = this.metadata.image;
    return Array.isArray(image) ? image[0] : image;
  }

  switchVariant({ target }: { target: HTMLElement }) {
    const variantIndex = target.dataset['index'];
    this.update({ variantIndex });
  }
}
