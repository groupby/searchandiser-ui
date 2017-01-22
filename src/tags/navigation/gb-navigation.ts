import { displayRefinement as toView, toRefinement } from '../../utils/common';
import { FluxTag, TagConfigure } from '../tag';
import * as clone from 'clone';
import { Events, Navigation as NavModel, NavigationInfo, RefinementResults, Results } from 'groupby-api';

export { NavigationInfo }

export interface NavigationOpts {
  badge?: boolean;
  showSelected?: boolean;
}

export interface SelectionNavigation extends NavModel {
  selected: any[];
}

export const DEFAULTS = {
  badge: true,
  showSelected: true
};
export const TYPES = {
  badge: 'boolean',
  showSelected: 'boolean'
};

export class Navigation extends FluxTag<NavigationOpts> {

  badge: boolean;
  showSelected: boolean;

  processed: SelectionNavigation[];

  init() {
    this.expose('navigable');
    this.mixin({ toView });

    this.flux.on(Events.RESULTS, this.updateNavigations);
    this.flux.on(Events.REFINEMENT_RESULTS, this.updateRefinements);
  }

  onConfigure(configure: TagConfigure) {
    configure({ defaults: DEFAULTS, types: TYPES });
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

  send(refinement: any, navigation: any) {
    return this.flux.refine(toRefinement(refinement, navigation));
  }

  remove(refinement: any, navigation: any) {
    return this.flux.unrefine(toRefinement(refinement, navigation));
  }
}
