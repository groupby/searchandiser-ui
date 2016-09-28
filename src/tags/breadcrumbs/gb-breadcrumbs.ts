import { displayRefinement, toRefinement } from '../../utils/common';
import { FluxTag } from '../tag';
import { Events, Results } from 'groupby-api';

export interface BreadcrumbsConfig {
  hideQuery?: boolean;
  hideRefinements?: boolean;
}

export const DEFAULT_CONFIG: BreadcrumbsConfig = {
  hideQuery: false,
  hideRefinements: false
};

export interface Breadcrumbs extends FluxTag<BreadcrumbsConfig> { }

export class Breadcrumbs {

  selected: any[];
  originalQuery: string;
  toView: typeof displayRefinement;

  init() {
    this.configure(DEFAULT_CONFIG);
    this.toView = displayRefinement;

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
