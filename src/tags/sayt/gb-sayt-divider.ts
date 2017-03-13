import { FluxTag } from '../tag';

export class SaytDivider extends FluxTag<any> {

  isVisible() {
    return this.root.nextElementSibling &&
      this.root.nextElementSibling.querySelector('li') &&
      this.root.previousElementSibling &&
      this.root.previousElementSibling.querySelector('li');
  }
}
