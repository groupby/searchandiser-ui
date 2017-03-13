import { FluxTag } from '../tag';

export class RefinementList extends FluxTag<any> {
  navigation: any;

  init() {
    this.expose('navigation', this.navigation);
  }

  selectedRefinements() {
    return this.navigation.refinements.filter((refinement) => refinement.selected);
  }

  availableRefinements() {
    return this.navigation.refinements.filter((refinement) => !refinement.selected);
  }
}
