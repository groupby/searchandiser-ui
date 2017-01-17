import { displayRefinement as toView, toRefinement } from '../../utils/common';
import { FluxTag, TagConfigure } from '../tag';
import { Events, Results } from 'groupby-api';

export interface BreadcrumbsConfig {
  items: any[];
  hideQuery?: boolean;
  hideRefinements?: boolean;
  labels?: boolean;
  resultsLabel?: string;
  noResultsLabel?: string;
  correctedResultsLabel?: string;
}

export const DEFAULTS = {
  labels: true,
  resultsLabel: 'Results for:',
  noResultsLabel: 'No results for:',
  correctedResultsLabel: 'Showing results for:'
};
export const TYPES = {
  hideQuery: 'boolean',
  hideRefinements: 'boolean',
  labels: 'boolean'
};

export class Breadcrumbs extends FluxTag<any> {

  items: any[];
  hideQuery: boolean;
  hideRefinements: boolean;
  labels: boolean;
  resultsLabel: string;
  noResultsLabel: string;
  correctedResultsLabel: string;

  originalQuery: string;
  correctedQuery: string;

  init() {
    this.expose(['breadcrumbs', 'listable']);
    this.mixin({ toView });

    this.flux.on(Events.RESULTS, this.updateQueryState);
    this.flux.on(Events.RESET, this.clearRefinements);
  }

  onConfigure(configure: TagConfigure) {
    configure({ defaults: DEFAULTS, types: TYPES });
  }

  clearRefinements() {
    this.update({ items: [] });
  }

  updateQueryState({  selectedNavigation: items, originalQuery, correctedQuery }: Results) {
    this.update({ items, originalQuery, correctedQuery });
  }

  remove(refinement: any, navigation: any) {
    this.flux.unrefine(toRefinement(refinement, navigation));
  }
}
