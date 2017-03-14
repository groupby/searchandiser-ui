import { clone, displayRefinement as toView, refinementMatches, toRefinement } from '../../utils/common';
import { meta } from '../../utils/decorators';
import { FluxTag, TagMeta } from '../tag';
import { Events, Navigation as NavModel, NavigationInfo, RefinementResults, Results } from 'groupby-api';

export { NavigationInfo }

export interface NavigationOpts {
  badge?: boolean;
  showSelected?: boolean;
}

export interface SelectionNavigation extends NavModel {
  selected: any[];
}

export const META: TagMeta = {
  defaults: {
    badge: true,
    showSelected: true,
    hoistSelected: true
  },
  types: {
    badge: 'boolean',
    showSelected: 'boolean',
    hoistSelected: 'boolean'
  }
};

@meta(META)
export class Navigation extends FluxTag<NavigationOpts> {

  badge: boolean;
  showSelected: boolean;
  hoistSelected: boolean;

  processed: SelectionNavigation[];

  init() {
    this.expose('navigable');
    this.mixin({ toView });

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
      const selected = this.flux.results.selectedNavigation.find((nav) => nav.name === res.navigation.name);
      if (selected) {
        this.mergeRefinements(found, selected);
      }
    }
    return this.processed;
  }

  processNavigations({ availableNavigation: available, selectedNavigation: selected }: Results) {
    const processed = <SelectionNavigation[]>clone(available);
    selected.forEach((selectedNav) => {
      const availableNav = processed.find((nav) => nav.name === selectedNav.name);
      if (availableNav) {
        this.mergeRefinements(availableNav, selectedNav);
      } else {
        selectedNav.refinements.forEach((refinement) => refinement['selected'] = true);
        processed.unshift(<any>selectedNav);
      }
    });
    return processed;
  }

  mergeRefinements(availableNavigation: any, selectedNavigation: any) {
    selectedNavigation.refinements.forEach((refinement) => {
      const availableRefinement = availableNavigation.refinements
        .find((availableRef) => refinementMatches(availableRef, refinement));
      if (availableRefinement) {
        availableRefinement['selected'] = true;
      } else {
        availableNavigation.refinements.unshift(Object.assign(refinement, { selected: true }));
      }
    });

    if (this.hoistSelected) {
      availableNavigation.refinements = availableNavigation.refinements.sort(this.sortRefinements);
    }
  }

  sortRefinements(lhs: any, rhs: any) {
    if (!lhs.selected && !rhs.selected) {
      return 1;
    } else if (lhs.selected === rhs.selected) {
      return lhs.value.localeCompare(rhs.value);
    } else {
      return lhs.selected ? -1 : 1;
    }
  }

  send(refinement: any, navigation: any) {
    return this.flux.refine(toRefinement(refinement, navigation));
  }

  remove(refinement: any, navigation: any) {
    return this.flux.unrefine(toRefinement(refinement, navigation));
  }
}
