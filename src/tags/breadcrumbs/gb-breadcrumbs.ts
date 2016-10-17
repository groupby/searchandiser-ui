import { displayRefinement, toRefinement } from '../../utils/common';
import { FluxTag } from '../tag';
import { Events, Results } from 'groupby-api';

export interface BreadcrumbsConfig {
  hideQuery?: boolean;
  hideRefinements?: boolean;
  labels?: boolean;
  resultsLabel?: string;
  noResultsLabel?: string;
  correctedResultsLabel?: string;
}

export const DEFAULT_CONFIG: BreadcrumbsConfig = {
  hideQuery: false,
  hideRefinements: false,
  labels: true,
  resultsLabel: 'Results for:',
  noResultsLabel: 'No results for:',
  correctedResultsLabel: 'Showing results for:'
};

export interface Breadcrumbs extends FluxTag<BreadcrumbsConfig> { }

export class Breadcrumbs {

  selected: any[];
  originalQuery: string;
  toView: typeof displayRefinement;
  correctedQuery: string;

  init() {
    this.configure(DEFAULT_CONFIG);
    this.toView = displayRefinement;

    this.flux.on(Events.RESULTS, this.updateQueryState);
    this.flux.on(Events.RESET, this.clearRefinements);
  }

  clearRefinements() {
    this.update({ selected: [] });
  }

  updateQueryState({ originalQuery, selectedNavigation, correctedQuery }: Results) {
    this.update({ originalQuery, selected: selectedNavigation, correctedQuery });
  }

  remove(ref: any, nav: any) {
    this.flux.unrefine(toRefinement(ref, nav));
  }
}
