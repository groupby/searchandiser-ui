import { FluxTag } from '../tag';

export interface RefinementList extends FluxTag<any> {
  navigation: any;
}

export class RefinementList {

  init() {
    this.alias('navigation', this.navigation);
  }
}
