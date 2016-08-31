import { toRefinement, unless } from '../../utils';
import { FluxTag } from '../tag';
import { Events, Navigation as NavModel, NavigationInfo, Results } from 'groupby-api';
import clone = require('clone');

export { NavigationInfo }

export interface Navigation extends FluxTag { }

export class Navigation {

  badge: boolean;
  showSelected: boolean;

  init() {
    this.badge = unless(this.opts.badge, true);
    this.showSelected = unless(this.opts.showSelected, true);
    this.flux.on(Events.RESULTS, this.updateNavigations);
  }

  updateNavigations(res: Results) {
    this.update({ processed: this.processNavigations(res) });
  }

  processNavigations({ selectedNavigation, availableNavigation }: Results) {
    let processed = <SelectionNavigation[]>clone(availableNavigation);
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

  send(ref: any, nav: any) {
    return this.flux.refine(toRefinement(ref, nav));
  }

  remove(ref: any, nav: any) {
    return this.flux.unrefine(toRefinement(ref, nav));
  }
}

export interface SelectionNavigation extends NavModel {
  selected: any[];
}
