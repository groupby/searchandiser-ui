import { displayRefinement as toView, toRefinement } from '../../utils/common';
import { meta } from '../../utils/decorators';
import { FluxTag, TagMeta } from '../tag';
import { Events, Results } from 'groupby-api';

export interface BreadcrumbsOpts {
  items: any[];
  hideQuery?: boolean;
  hideRefinements?: boolean;
  labels?: boolean;
  resultsLabel?: string;
  noResultsLabel?: string;
  correctedResultsLabel?: string;
}

export const META: TagMeta = {
  defaults: {
    labels: true,
    resultsLabel: 'Results for:',
    noResultsLabel: 'No results for:',
    correctedResultsLabel: 'Showing results for:'
  },
  types: {
    hideQuery: 'boolean',
    hideRefinements: 'boolean',
    labels: 'boolean'
  }
};

@meta(META)
export class Breadcrumbs extends FluxTag<BreadcrumbsOpts> {

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
