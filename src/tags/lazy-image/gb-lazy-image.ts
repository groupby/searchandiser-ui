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

    this._scope.on('mount', this.maybeLoadImage);
    this._scope.on('update', this.maybeLoadImage);

    if (this._config.src) {
      this.lazyLoad(this._config.src);
    }
  }

  maybeLoadImage() {
    const imageUrl = this._scope.productMeta().image;
    if (imageUrl && (!this.refs.lazyImage || this.refs.lazyImage.src !== imageUrl)) {
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
    this.refs.lazyImage.src = image.src;
    this.refs.lazyImage.height = image.height;
    this.refs.lazyImage.width = image.width;
  }
}
