import { FluxTag } from '../tag';

export interface Icon extends FluxTag { }

export class Icon {

  url: string;
  classes: string;

  init() {
    if (this.isImage(this.opts.value)) {
      this.url = this.opts.value;
    } else {
      this.classes = this.opts.value;
    }
  }

  private isImage(value: string) {
    const matches = value.match(/.*\..*/);
    return (matches && matches.length > 0) || value.startsWith('data:image/');
  }
}
