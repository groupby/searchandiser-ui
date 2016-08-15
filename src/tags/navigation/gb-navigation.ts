import { FluxTag } from '../tag';
import { unless, toRefinement } from '../../utils';
import { Events, Results, Navigation as NavModel, NavigationInfo } from 'groupby-api';

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
    return selectedNavigation
      .map((nav: NavModel) => Object.assign(nav, { selected: true }))
      .concat(availableNavigation)
      .reduce(this.combineNavigations, {});
  }

  send(ref, nav) {
    return this.flux.refine(toRefinement(ref, nav));
  }

  remove(ref, nav) {
    return this.flux.unrefine(toRefinement(ref, nav));
  }

  private combineNavigations(processed: any, nav: SelectionNavigation) {
    return Object.assign(processed, { [nav.name]: Object.assign(processed[nav.name] ? processed[nav.name] : nav, { [nav.selected ? 'selected' : 'available']: nav.refinements }) });
  }
}

export interface SelectionNavigation extends NavModel {
  selected: boolean;
}
