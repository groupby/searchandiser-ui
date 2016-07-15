import { unless } from '../../utils';
import { Events, Results, Navigation } from 'groupby-api';

export function Navigation() {
  this.init = function() {
    this.badge = unless(this.opts.badge, true);
    this.showSelected = unless(this.opts.showSelected, true);
    this.opts.flux.on(Events.RESULTS, (res: Results) => this.update({ processed: this.processNavigations(res) }));
  };

  this.processNavigations = function(res: Results) {
    return res.selectedNavigation
      .map((nav: Navigation) => Object.assign(nav, { selected: true }))
      .concat(res.availableNavigation)
      .reduce(this.combineNavigations, {});
  };

  this.combineNavigations = function(processed: any, nav: SelectionNavigation) {
    return Object.assign(processed, { [nav.name]: Object.assign(processed[nav.name] ? processed[nav.name] : nav, { [nav.selected ? 'selected' : 'available']: nav.refinements }) });
  };
}

interface SelectionNavigation extends Navigation {
  selected: boolean;
}
