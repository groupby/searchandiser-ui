import { displayRefinement as toView, toRefinement } from '../../utils/common';
import { meta } from '../../utils/decorators';
import { FluxTag, TagMeta } from '../tag';
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

export const META: TagMeta = {
  defaults: {
    badge: true,
    showSelected: true
  },
  types: {
    badge: 'boolean',
    showSelected: 'boolean'
  }
};

@meta(META)
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

  processNavigations({ availableNavigation: available, selectedNavigation: selected }: Results) {
    const processed = <SelectionNavigation[]>clone(available);
    selected.forEach((selectedNav) => {
      const availableNav = processed.find((nav) => nav.name === selectedNav.name);
      if (availableNav) {
        this.markSelected(availableNav, selectedNav);
      } else {
        selectedNav.refinements.forEach((refinement) => refinement['selected'] = true);
        processed.unshift(<any>selectedNav);
      }
    });
    return processed;
  }

  markSelected(availableNavigation: any, selectedNavigation: any) {
    console.log('available', availableNavigation);
    console.log('selected', selectedNavigation);
    selectedNavigation.refinements.forEach((refinement) => {
      const availableRefinement = availableNavigation.refinements.find((availableRef) => {
        if (availableRef.type === refinement.type) {
          if (availableRef.type === 'Value') {
            return (<any>availableRef).value === (<any>refinement).value;
          } else {
            return (<any>availableRef).low === (<any>refinement).low &&
              (<any>availableRef).high === (<any>refinement).high;
          }
        }
      });
      if (availableRefinement) {
        availableRefinement['selected'] = true;
      } else {
        selectedNavigation.refinements.unshift(Object.assign(refinement, { selected: true }));
      }
    });
    // availableNavigation.refinements.forEach((refinement) => {
    //   const selectedRefinement = selectedNavigation.refinements.find((selectedRef) => {
    //     if (selectedRef.type === refinement.type) {
    //       if (selectedRef.type === 'Value') {
    //         return (<any>selectedRef).value === (<any>refinement).value;
    //       } else {
    //         return (<any>selectedRef).low === (<any>refinement).low &&
    //           (<any>selectedRef).high === (<any>refinement).high;
    //       }
    //     }
    //   });
    //   if (selectedRefinement) {
    //     refinement['selected'] = true;
    //   }
    // });
  }

  send(refinement: any, navigation: any) {
    return this.flux.refine(toRefinement(refinement, navigation));
  }

  remove(refinement: any, navigation: any) {
    return this.flux.unrefine(toRefinement(refinement, navigation));
  }
}
