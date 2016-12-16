import { FluxTag } from '../tag';

export interface ProductImage extends FluxTag<any> { }

export class ProductImage {

  init() {
    this.$scopeTo('gb-product');
  }

  imageLink() {
    return this.$scope.image(this.$scope.productMeta().image);
  }
}
