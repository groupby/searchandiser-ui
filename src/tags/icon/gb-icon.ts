import { FluxTag } from '../tag';

export const IMAGE_PATTERN = /.*\..*/;
export const DATA_URL_PREFIX = 'data:image/';

export interface IconConfig {
  value: string;
}

export interface Icon extends FluxTag<any> { }

export class Icon {

  url: string;
  classes: string;

  init() {
    this.setImage();

    this.on('update', this.setImage);
  }

  setImage() {
    if (this.isImage(this.opts.value)) {
      this.url = this.opts.value;
      delete this.classes;
    } else {
      this.classes = this.opts.value;
      delete this.url;
    }
  }

  isImage(value: string) {
    const matches = value.match(IMAGE_PATTERN);
    return (matches && matches.length > 0) || value.startsWith(DATA_URL_PREFIX);
  }
}
