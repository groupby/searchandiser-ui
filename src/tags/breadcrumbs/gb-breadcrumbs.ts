import { checkBooleanAttr, displayRefinement, toRefinement } from '../../utils';
import { FluxTag } from '../tag';
import { Events, Results } from 'groupby-api';

export interface Breadcrumbs extends FluxTag { }

export class Breadcrumbs {

  selected: any[];
  originalQuery: string;
  hideQuery: boolean;
  hideRefinements: boolean;
  toView: typeof displayRefinement;

  init() {
    this.toView = displayRefinement;
    this.hideQuery = checkBooleanAttr('hideQuery', this.opts);
    this.hideRefinements = checkBooleanAttr('hideRefinements', this.opts);

    this.flux.on(Events.RESULTS, ({ originalQuery, selectedNavigation }: Results) => {
      this.updateQuery(originalQuery);
      this.updateRefinements(selectedNavigation);
    });
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
