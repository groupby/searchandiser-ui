import { FluxTag } from '../tag';
import { toRefinement, displayRefinement } from '../../utils';

export interface RefinementCrumb extends FluxTag { }

export class RefinementCrumb {

  toView: typeof displayRefinement;
  parentOpts: any;
  ref: any;
  nav: any;

  init() {
    this.toView = displayRefinement;
    this.parentOpts = this.parent.parent.opts;
  }

  remove() {
    this.parentOpts.flux.unrefine(toRefinement(this.ref, this.nav));
  }
}
