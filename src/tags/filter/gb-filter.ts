import { FluxTag } from '../tag';
import { FluxCapacitor, Events, QueryConfiguration, Results } from 'groupby-api';
import { toRefinement } from '../../utils';
import { SelectTag } from '../select/gb-select';

export interface Filter extends SelectTag { }

export class Filter {

  fluxClone: FluxCapacitor;
  navField: string;
  selected: any;

  init() {
    this.navField = this.opts.field;
    this.hover = this.opts.onHover;
    this.label = this.opts.label || 'Filter';
    this.clear = this.opts.clear || 'Unfiltered';
    this.fluxClone = this._clone();

    this.flux.on(Events.RESULTS, () => this.updateFluxClone());
  }

  isTargetNav(navName: string) {
    return navName === this.navField;
  }

  convertRefinements(navigations): any[] {
    const found = navigations.find(({ name }) => this.isTargetNav(name));
    return found ? found.refinements.map((ref) => ({ label: ref.value, value: ref })) : [];
  }

  updateValues(res: Results) {
    return this.update({ options: this.convertRefinements(res.availableNavigation) });
  }

  updateFluxClone() {
    const searchRequest = this.flux.query.raw;
    // TODO this is probably broken in terms of state propagation
    this.fluxClone.query.withConfiguration(<QueryConfiguration>{ refinements: [] });
    if (searchRequest.refinements) {
      const filteredRefinements: any[] = searchRequest.refinements.filter(({ navigationName }) => !this.isTargetNav(navigationName));
      this.fluxClone.query.withSelectedRefinements(...filteredRefinements);
    }

    this.fluxClone.search(searchRequest.query).then(this.updateValues);
  }

  onselect(value) {
    if (this.selected) this.flux.unrefine(this.selected, { skipSearch: true });
    if (value === '*') {
      this.flux.reset();
    } else {
      this.flux.refine(this.selected = toRefinement(value, { name: this.navField }));
    }
  }
}
