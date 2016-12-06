import { FluxTag } from '../tag';

export interface LayoutToggle extends FluxTag<any> { }

export class LayoutToggle {

  init() {
    this.configure();
  }

}
