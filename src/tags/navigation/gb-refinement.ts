import { FluxTag } from '../tag';
import { Navigation } from './gb-navigation';
import { NavigationInfo } from 'groupby-api';

export { NavigationInfo };

export class Refinement extends FluxTag<any> {
  $navigable: Navigation;
  $navigation: any;
  refinement: any;

  init() {
    this.expose('refinement', this.refinement);
  }
}

export class AvailableRefinement extends Refinement {
  send() {
    return this.$navigable.send(this.refinement, this.$navigation);
  }
}

export class SelectedRefinement extends Refinement {
  remove() {
    return this.$navigable.remove(this.refinement, this.$navigation);
  }
}
