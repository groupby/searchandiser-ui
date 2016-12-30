import { displayRefinement } from '../../utils/common';
import { toRefinement, Refinement } from '../../utils/common';
import { FluxTag } from '../tag';
import * as clone from 'clone';
import {
  Events,
  Navigation as NavModel,
  NavigationInfo,
  RefinementResults,
  Results
} from 'groupby-api';

export { NavigationInfo, Refinement }

export interface NavigationConfig {
  badge?: boolean;
  showSelected?: boolean;
}

export const DEFAULT_CONFIG: NavigationConfig = {
  badge: true,
  showSelected: true
};

export const SCHEMA = {
  badge: { value: true, for: 'gb-available-refinement' },
  showSelected: { value: true, for: 'gb-refinement-list' },
  fetchRefinements: {
    value() {
      this.flux.refinements(this.parent.navigation.name);
      this.parent.navigation.moreRefinements = false;
    }, for: 'gb-more-refinements'
  },
  selectRefinement: {
    value() {
      return this.flux.refine(toRefinement(this.refinement, this.parent.navigation));
    }, for: 'gb-available-refinement'
  },
  removeRefinement: {
    value() {
      return this.flux.unrefine(toRefinement(this.refinement, this.parent.navigation));
    }, for: 'gb-selected-refinement'
  },
  toView: { value: displayRefinement, for: 'gb-available-refinement, gb-selected-refinement' }
};

export interface Navigation extends FluxTag<NavigationConfig> { }

export class Navigation {

  processed: SelectionNavigation[];

  init() {
    this.$schema(SCHEMA);

    this.flux.on(Events.RESULTS, this.updateNavigations);
    this.flux.on(Events.REFINEMENT_RESULTS, this.updateRefinements);
  }

  updateNavigations(res: Results) {
    this.update({ processed: this.processNavigations(res) });
  }

  updateRefinements(res: RefinementResults) {
    this.update({ processed: this.replaceRefinements(res) });
  }

  replaceRefinements(res: RefinementResults) {
    const found = this.processed.find((nav) => nav.name === res.navigation.name);
    if (found) {
      found.refinements = res.navigation.refinements;
    }
    return this.processed;
  }

  processNavigations({ selectedNavigation, availableNavigation }: Results) {
    const processed = <SelectionNavigation[]>clone(availableNavigation);
    selectedNavigation.forEach((selNav) => {
      const availNav = processed.find((nav) => nav.name === selNav.name);
      if (availNav) {
        availNav.selected = selNav.refinements;
      } else {
        processed.unshift(Object.assign({}, selNav, { selected: selNav.refinements, refinements: [] }));
      }
    });
    return processed;
  }
}

export interface SelectionNavigation extends NavModel {
  selected: any[];
}
