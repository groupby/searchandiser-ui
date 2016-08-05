import { FluxTag } from '../tag';
import { toRefinement, displayRefinement } from '../../utils';

export interface RefinementCrumb extends FluxTag { }

export class RefinementCrumb {

  parentOpts: any;
  ref: any;
  nav: any;
  toView: typeof displayRefinement;

  init() {
    this.toView = displayRefinement;
    this.parentOpts = this.parent.parent.opts;
  }

  remove() {
    this.flux.unrefine(toRefinement(this.ref, this.nav));
  }
}
