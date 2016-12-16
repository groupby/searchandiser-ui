import { WINDOW } from '../../utils/common';
import { FluxTag } from '../tag';

export interface LazyImageConfig {
  src: string;
}

export interface LazyImage extends FluxTag<LazyImageConfig> {
  refs: {
    lazyImage: HTMLImageElement;
  };
}

export class LazyImage extends FluxTag<LazyImageConfig> {

  init() {
    this.configure();

    this.$scope.on('mount', this.maybeLoadImage);
    this.$scope.on('update', this.maybeLoadImage);
  }

  maybeLoadImage() {
    const imageUrl = this.$config.src || this.$scope.productMeta().image;
    if (imageUrl) {
      this.lazyLoad(imageUrl);
    }
  }

  lazyLoad(imageUrl: string) {
    return new Promise((resolve, reject) => {
      const image = WINDOW.Image();
      const onLoad = () => resolve(image);
      const onError = () => resolve('');

      image.src = imageUrl;
      image.addEventListener('load', onLoad);
      image.addEventListener('error', onError);

      this.on('unmount', () => {
        image.removeEventListener('load', onLoad);
        image.removeEventListener('error', onError);
        resolve('');
      });
    }).then(this.processImage);
  }

  processImage(image: HTMLImageElement) {
    if (image && this.refs.lazyImage && this.refs.lazyImage.src !== image.src) {
      this.refs.lazyImage.src = image.src;
      this.refs.lazyImage.height = image.height;
      this.refs.lazyImage.width = image.width;
    }
  }
}
