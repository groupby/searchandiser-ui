import { checkBooleanAttr, displayRefinement as toView, toRefinement } from '../../utils/common';
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

export interface Breadcrumbs extends FluxTag<any> { }

export class Breadcrumbs {

  hideQuery: boolean;
  hideRefinements: boolean;
  labels: boolean;
  resultsLabel: string;
  noResultsLabel: string;
  correctedResultsLabel: string;

  selected: any[];
  originalQuery: string;
  correctedQuery: string;

  init() {
    this.alias('breadcrumbs');
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
    this.update({ selected: [] });
  }

  updateQueryState({ originalQuery, selectedNavigation, correctedQuery }: Results) {
    this.update({ originalQuery, selected: selectedNavigation, correctedQuery });
  }

  remove(refinement: any, navigation: any) {
    this.flux.unrefine(toRefinement(refinement, navigation));
  }
}
