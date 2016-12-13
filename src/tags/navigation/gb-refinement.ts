import { displayRefinement } from '../../utils/common';
import { FluxTag } from '../tag';

export interface Refinement extends FluxTag<any> {
  parent: FluxTag<any> & { navigation: any; };
}

export class Refinement {

  refinement: any;
  toView: typeof displayRefinement;

  init() {
    this._scopeTo('gb-navigation');
    this.toView = displayRefinement;
  }
}

export class AvailableRefinement extends Refinement {
  send() {
    return this._scope.send(this.refinement, this.parent.navigation);
  }
}

export class SelectedRefinement extends Refinement {
  remove() {
    return this._scope.remove(this.refinement, this.parent.navigation);
  }
}
