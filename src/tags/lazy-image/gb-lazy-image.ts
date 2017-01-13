import { WINDOW } from '../../utils/common';
import { Product } from '../product/gb-product';
import { FluxTag } from '../tag';

export interface LazyImageConfig {
  src: string;
}

export class LazyImage extends FluxTag<LazyImageConfig> {
  $product: Product;
  refs: { lazyImage: HTMLImageElement };

  init() {
    this.on('mount', this.maybeLoadImage);
    this.on('update', this.maybeLoadImage);
  }

  maybeLoadImage() {
    const imageUrl = this.$product.imageLink();
    if (imageUrl && this.refs.lazyImage.src !== imageUrl) {
      this.lazyLoad(imageUrl);
    }
  }

  lazyLoad(imageUrl: string) {
    return new Promise((resolve, reject) => {
      const image = WINDOW.Image();
      image.src = imageUrl;
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', () => resolve(''));
    }).then(this.processImage);
  }

  processImage(image: HTMLImageElement) {
    if (this.refs.lazyImage) {
      this.refs.lazyImage.src = image.src;
      this.refs.lazyImage.height = image.height;
      this.refs.lazyImage.width = image.width;
    }
  }
}
