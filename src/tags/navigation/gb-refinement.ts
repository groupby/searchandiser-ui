import { FluxTag } from '../tag';
import { toRefinement, displayRefinement } from '../../utils';

export interface Refinement extends FluxTag { }

export class Refinement {

  parentOpts: any;
  toView: typeof displayRefinement;
  toRefinement: typeof toRefinement;

  init() {
    this.parentOpts = this.parent.parent.opts;
    this.toView = displayRefinement;
    this.toRefinement = toRefinement;
  }
}
