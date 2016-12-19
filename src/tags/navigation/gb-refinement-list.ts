import { FluxTag } from '../tag';

export interface RefinementList extends FluxTag<any> {
  navigation: any;
}

export class RefinementList {

  moreRefinements() {
    this.flux.refinements(this.navigation.name);
    this.navigation.moreRefinements = false;
  }
}
