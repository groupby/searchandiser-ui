import { FluxTag } from '../tag';

export interface MoreRefinements extends FluxTag<any> {
  $navigation: any;
}

export class MoreRefinements {

  loadMore() {
    this.flux.refinements(this.$navigation.name);
    this.$navigation.moreRefinements = false;
  }
}
