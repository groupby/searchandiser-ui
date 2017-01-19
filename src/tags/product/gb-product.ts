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

export const DEFAULTS = {
  lazy: true
};
export const TYPES = {
  lazy: 'boolean',
  infinite: 'boolean',
  tombstone: 'boolean'
};

export class Product extends FluxTag<any> {
  $productable: Productable;

  variantIndex: number;
  detailsUrl: string;
  metadata: any;
  variants: any[];
  structure: ProductStructure;
  transformer: ProductTransformer;

  init() {
    this.expose('product');
    this.depend('productable', { defaults: DEFAULTS, types: TYPES }, this.transformProductable);

    this.structure = Object.assign({}, this.config.structure, (this.$productable || <any>{}).structure);
    this.transformer = new ProductTransformer(this.structure);

    this.on('before-mount', this.styleProduct);
  }

  onConfigure() {
    this.variantIndex = 0;
    this.detailsUrl = oget(this.services, 'url.urlConfig.detailsUrl', 'details.html');
  }

  transformProductable(productable: Productable) {
    this.updateRecord(productable.allMeta);
    return productable;
  }

  productable(obj: any = {}) {
    return Object.assign(obj, this.$productable, this.opts);
  }

  updateRecord(allMeta: any) {
    const variants = this.transformRecord(allMeta);
    this.variants = variants;
    this.metadata = variants[0];
  }

  transformRecord(record: any): any {
    return this.transformer.transform(clone(record, false));
  }

  styleProduct() {
    if (this.$productable.infinite) {
      this.root.classList.add('gb-infinite');
    }
    if (this.$productable.tombstone) {
      this.root.classList.add('tombstone');
    }
  }

  variant() {
    if (this.variants && this.variants.length > this.variantIndex) {
      return this.variants[this.variantIndex];
    } else {
      return this.metadata || {};
    }
  }

  link() {
    return this.variant().url || `${this.detailsUrl}?id=${this.variant().id}`;
  }

  imageLink() {
    const image = this.variant().image;
    return Array.isArray(image) ? image[0] : image;
  }

  switchVariant({ target }: { target: HTMLElement }) {
    const variantIndex = target.dataset['index'];
    this.update({ variantIndex });
  }
}
