import { FluxTag } from '../tag';

export const IMAGE_PATTERN = /.*\..*/;
export const DATA_URL_PREFIX = 'data:image/';

export interface IconConfig {
  value: string;
}

export interface Icon extends FluxTag<IconConfig> { }

export class Icon {

  url: string;
  classes: string;

  init() {
    this.configure();
    if (this.isImage(this.$config.value)) {
      this.url = this.$config.value;
    } else {
      this.classes = this.$config.value;
    }
  }

  private isImage(value: string) {
    const matches = value.match(IMAGE_PATTERN);
    return (matches && matches.length > 0) || value.startsWith(DATA_URL_PREFIX);
  }
}
