import { FluxTag } from '../tag';
import { unless, toRefinement, displayRefinement } from '../../utils';
import { Events, Results, Navigation as NavModel } from 'groupby-api';

export interface RawNavigation extends FluxTag { }

export class RawNavigation {

  badge: boolean;
  showSelected: boolean;
  toView: Function;
  toRefinement: Function;

  init() {
    this.badge = unless(this.opts.badge, true);
    this.showSelected = unless(this.opts.showSelected, true);
    this.flux.on(Events.RESULTS, (res: Results) => this.update({ processed: this.processNavigations(res) }));
    this.toView = displayRefinement;
    this.toRefinement = toRefinement;
  }

  processNavigations(res: Results) {
    return res.selectedNavigation
      .map((nav: NavModel) => Object.assign(nav, { selected: true }))
      .concat(res.availableNavigation)
      .reduce(this.combineNavigations, {});
  }

  combineNavigations(processed: any, nav: SelectionNavigation) {
    return Object.assign(processed, { [nav.name]: Object.assign(processed[nav.name] ? processed[nav.name] : nav, { [nav.selected ? 'selected' : 'available']: nav.refinements }) });
  }
}

export interface SelectionNavigation extends NavModel {
  selected: boolean;
}
