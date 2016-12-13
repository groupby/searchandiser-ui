import { FluxTag } from '../tag';

export interface ProductImage extends FluxTag<any> { }

export class ProductImage {

  init() {
    this._scopeTo('gb-product');
  }

  imageLink() {
    return this._scope.image(this._scope.productMeta().image);
  }
}
