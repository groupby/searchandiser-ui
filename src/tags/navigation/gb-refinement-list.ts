import { FluxTag } from '../tag';

export class RefinementList extends FluxTag<any> {
  navigation: any;

  init() {
    this.expose('navigation', this.navigation);
  }
}
