import { FluxTag } from '../tag';

export class MoreRefinements extends FluxTag<any> {
  $navigation: any;

  loadMore() {
    this.flux.refinements(this.$navigation.name);
    this.$navigation.moreRefinements = false;
  }
}
