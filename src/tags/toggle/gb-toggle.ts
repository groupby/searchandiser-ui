import { FluxTag } from '../tag';

export interface ToggleConfig {
}

export interface Toggle extends FluxTag<ToggleConfig> { }

export class Toggle {

  init() {
    this.configure();
  }

}
