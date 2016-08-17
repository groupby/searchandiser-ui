import { FluxTag } from '../tag';
import { unless, toRefinement } from '../../utils';
import { Events, Results, Navigation as NavModel, NavigationInfo } from 'groupby-api';
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
    selectedNavigation.forEach(selNav => {
      let match = false;
      processed.forEach(availNav => {
        if (match = availNav.name === selNav.name) {
          availNav.selected = selNav.refinements;
        }
      });
      if (!match) {
        processed.unshift(Object.assign({}, selNav, { selected: selNav.refinements, refinements: [] }));
      }
    });
    return processed;
  }

  send(ref, nav) {
    return this.flux.refine(toRefinement(ref, nav));
  }

  remove(ref, nav) {
    return this.flux.unrefine(toRefinement(ref, nav));
  }
}

export interface SelectionNavigation extends NavModel {
  selected: any[];
}
