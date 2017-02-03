import { FluxTag } from '../tag';

export const IMAGE_PATTERN = /.*\..*/;
export const DATA_URL_PREFIX = 'data:image/';

export interface IconOpts {
  img: string;
}

export class Icon extends FluxTag<IconOpts> {

  url: string;
  classes: string;

  init() {
    this.on('update', this.setImage);
  }

  setDefaults() {
    this.setImage();
  }

  setImage() {
    if (this.isImage(this.opts.img)) {
      this.url = this.opts.img;
      delete this.classes;
    } else {
      this.classes = this.opts.img;
      delete this.url;
    }
  }

  isImage(img: string) {
    const matches = img.match(IMAGE_PATTERN);
    return (matches && matches.length > 0) || img.startsWith(DATA_URL_PREFIX);
  }
}
