import { FluxTag } from '../tag';

export interface RefinementList extends FluxTag<any> {
  nav: any;
}

export class RefinementList {

  moreRefinements() {
    this.flux.refinements(this.nav.name);
    this.nav.moreRefinements = false;
  }
}
