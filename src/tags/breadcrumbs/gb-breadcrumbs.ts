import { checkBooleanAttr, displayRefinement as toView, toRefinement } from '../../utils/common';
import { FluxTag } from '../tag';
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
    this.alias(['breadcrumbs', 'listable']);
    this.mixin({ toView });

    this.hideQuery = checkBooleanAttr('hideQuery', this.opts);
    this.hideRefinements = checkBooleanAttr('hideRefinements', this.opts);
    this.labels = checkBooleanAttr('labels', this.opts, true);
    this.resultsLabel = this.opts.resultsLabel || 'Results for:';
    this.noResultsLabel = this.opts.noResultsLabel || 'No results for:';
    this.correctedResultsLabel = this.opts.correctedResultsLabel || 'Showing results for:';

    this.flux.on(Events.RESULTS, this.updateQueryState);
    this.flux.on(Events.RESET, this.clearRefinements);
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
