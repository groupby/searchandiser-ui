import assign = require('object-assign');
import { SelectedRefinement } from './request-models';
import { Navigation } from './response-models';

export class NavigationConverter {
  static convert(navigations: Array<Navigation>): Array<SelectedRefinement> {
    return navigations.reduce((refinements: Array<SelectedRefinement>, navigation: Navigation) => {
      navigation.refinements.forEach(refinement => refinements.push(assign(refinement, { navigationName: navigation.name })));
      return refinements;
    }, []);
  }
}
