import { FluxTag } from '../tag';

export interface SaytDivider extends FluxTag<any> { }

export class SaytDivider {

  isVisible() {
    return this.root.nextElementSibling &&
      this.root.nextElementSibling.querySelector('li') &&
      this.root.previousElementSibling &&
      this.root.previousElementSibling.querySelector('li');
  }
}
