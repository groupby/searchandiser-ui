import { ProductMeta, ProductTransformer } from '../../utils/product-transformer';
import { FluxTag } from '../tag';
import * as clone from 'clone';

export interface Product extends FluxTag { }

export class Product {

  variantIndex: number;
  variants: any[];
  allMeta: any;
  struct: any;
  productMeta: ProductMeta;
  transformer: ProductTransformer;

  init() {
    this.variantIndex = 0;
    this.struct = this._scope.struct || this.config.structure || {};
    this.transformer = new ProductTransformer(this.struct);

    this.transformRecord(this.opts.all_meta);
  }

  transformRecord(allMeta: any) {
    const productMeta = this.transformer.transform(clone(allMeta, false));
    this.update({
      productMeta: () => productMeta(this.variantIndex),
      variants: productMeta.variants || [],
      allMeta: productMeta.transformedMeta
    });
  }

  link() {
    return this.productMeta().url || `details.html?id=${this.productMeta().id}`;
  }

  image(imageObj: string | string[]) {
    return Array.isArray(imageObj) ? imageObj[0] : imageObj;
  }

  switchVariant(event: MouseEvent) {
    const variantIndex = (<HTMLElement>event.target).dataset['index'];
    this.update({ variantIndex });
  }
}
