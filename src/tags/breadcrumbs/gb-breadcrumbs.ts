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

export const SCHEMA = {
  hideRefinements: { value: false },
  selected: { value: [] },

  hideQuery: { value: false, for: 'gb-query-crumb' },
  labels: { value: true, for: 'gb-query-crumb' },
  resultsLabel: { value: 'Results for:', for: 'gb-query-crumb' },
  noResultsLabel: { value: 'No results for:', for: 'gb-query-crumb' },
  correctedResultsLabel: { value: 'Showing results for:', for: 'gb-query-crumb' },
  originalQuery: { for: 'gb-query-crumb' },
  correctedQuery: { for: 'gb-query-crumb' },

  toView: { value: displayRefinement, for: 'gb-refinement-crumb' },
  removeRefinement: { value: removeRefinement, for: 'gb-refinement-crumb' }
};

export interface Breadcrumbs extends FluxTag<BreadcrumbsConfig> { }

export class Breadcrumbs {

  init() {
    this.$schema(SCHEMA);

    this.flux.on(Events.RESULTS, this.updateQueryState);
    this.flux.on(Events.RESET, this.clearRefinements);
  }

  clearRefinements() {
    this.$update({ selected: [] });
  }

  updateQueryState({ originalQuery, selectedNavigation: selected, correctedQuery }: Results) {
    this.$update({ originalQuery, selected, correctedQuery });
  }
}

export function removeRefinement() {
  this.flux.unrefine(toRefinement(this.refinement, this.navigation));
}
