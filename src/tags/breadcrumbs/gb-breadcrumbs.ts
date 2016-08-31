import { displayRefinement, toRefinement, unless } from '../../utils';
import { FluxTag } from '../tag';
import { Events } from 'groupby-api';

export interface Breadcrumbs extends FluxTag { }

export class Breadcrumbs {

  selected: any[];
  originalQuery: string;
  hideQuery: boolean;
  hideRefinements: boolean;
  toView: typeof displayRefinement;

  init() {
    this.toView = displayRefinement;
    this.hideQuery = unless(this.opts.hideQuery, false);
    this.hideRefinements = unless(this.opts.hideRefinements, false);

    this.flux.on(Events.REFINEMENTS_CHANGED, ({ selected }) => this.updateRefinements(selected));
    this.flux.on(Events.RESULTS, ({ originalQuery }) => this.updateQuery(originalQuery));
    this.flux.on(Events.RESET, () => this.clearRefinements());
  }

  clearRefinements() {
    this.updateRefinements([]);
  }

  updateRefinements(selected: any[]) {
    this.update({ selected });
  }

  updateQuery(originalQuery: string) {
    this.update({ originalQuery });
  }

  remove(ref: any, nav: any) {
    this.flux.unrefine(toRefinement(ref, nav));
  }
}
