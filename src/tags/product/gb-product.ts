import { ProductMeta, ProductTransformer } from '../../utils/product-transformer';
import { FluxTag } from '../tag';
import * as clone from 'clone';
import oget = require('oget');

export interface ProductConfig {
  lazy?: boolean;
  infinite?: boolean;
  tombstone?: boolean;
}

export const DEFAULT_CONFIG: ProductConfig = {
  lazy: true,
  infinite: false,
  tombstone: false
};

export interface Product extends FluxTag<ProductConfig> { }

export class Product {

  variantIndex: number;
  variants: any[];
  detailsUrl: string;
  allMeta: any;
  struct: any;
  productMeta: ProductMeta;
  transformer: ProductTransformer;

  init() {
    this.configure(DEFAULT_CONFIG);

    this.variantIndex = 0;
    this.detailsUrl = oget(this.services, 'url.urlConfig.detailsUrl', 'details.html');
    this.struct = this.config.structure || this._scope.struct || this.config.structure || {};
    this.transformer = new ProductTransformer(this.struct);

    this.styleProduct();
    this.transformRecord(this.opts.all_meta);
  }

  styleProduct() {
    if (this._config.infinite) {
      this.root.classList.add('gb-infinite');
    }
    if (this._config.tombstone) {
      this.root.classList.add('tombstone');
    }
  }

  transformRecord(allMeta: any = {}) {
    const productMeta = this.transformer.transform(clone(allMeta, false));
    this.update({
      productMeta: () => productMeta(this.variantIndex),
      variants: productMeta.variants || [],
      allMeta: productMeta.transformedMeta
    });
  }

  link() {
    return this.productMeta().url || `${this.detailsUrl}?id=${this.productMeta().id}`;
  }

  image(imageObj: string | string[]) {
    return Array.isArray(imageObj) ? imageObj[0] : imageObj;
  }

  switchVariant(event: MouseEvent) {
    const variantIndex = (<HTMLElement>event.target).dataset['index'];
    this.update({ variantIndex });
  }
}
