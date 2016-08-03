import { FluxTag } from '../tag';
import { toRefinement, displayRefinement } from '../../utils';

export interface Refinement extends FluxTag { }

export class Refinement {

  parentOpts: any;
  ref: any;
  nav: any;
  toView: typeof displayRefinement;
  toRefinement: typeof toRefinement;

  init() {
    this.parentOpts = this.parent.parent.opts;
    this.toView = displayRefinement;
    this.toRefinement = toRefinement;
  }
}

export class AvailableRefinement extends Refinement {
  send() {
    return this.parentOpts.flux.refine(this.toRefinement(this.ref, this.nav));
  }
}

export class SelectedRefinement extends Refinement {
  remove() {
    return this.parentOpts.flux.unrefine(this.toRefinement(this.ref, this.nav));
  }
}
