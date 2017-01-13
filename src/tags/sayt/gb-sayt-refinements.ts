import { FluxTag } from '../tag';

export class SaytRefinements extends FluxTag<any> {
  navigation: any;

  init() {
    this.alias('navigation', this.navigation);
  }
}
