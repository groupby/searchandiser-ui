import '../select/gb-raw-select.tag';
import { FluxTag } from '../tag';
import { FluxCapacitor, Events, QueryConfiguration, Results } from 'groupby-api';
import { toRefinement } from '../../utils';
import { SelectConfig } from '../select/gb-select';

export interface Filter extends FluxTag { }

export class Filter {

  fluxClone: FluxCapacitor;
  selectElement: { _tag: Filter };
  parentOpts: any;
  navField: string;
  selected: any;
  passthrough: SelectConfig;

  init() {
    this.parentOpts = this.opts.passthrough || this.opts;
    this.navField = this.parentOpts.field;

    this.fluxClone = this.parentOpts.clone();

    this.passthrough = Object.assign({}, this.parentOpts.__proto__, {
      hover: this.parentOpts.onHover,
      update: this.navigate,
      label: this.parentOpts.label || 'Filter',
      clear: this.parentOpts.clear || 'Unfiltered'
    });

    this.parentOpts.flux.on(Events.RESULTS, () => this.updateFluxClone());
  }

  isTargetNav(navName: string) {
    return navName === this.navField;
  }

  convertRefinements(navigations): any[] {
    const found = navigations.find(({ name }) => this.isTargetNav(name));
    return found ? found.refinements.map((ref) => ({ label: ref.value, value: ref })) : [];
  }

  updateValues(res: Results) {
    return this.selectElement._tag.update({ options: this.convertRefinements(res.availableNavigation) });
  }

  updateFluxClone() {
    const searchRequest = this.parentOpts.flux.query.raw;
    // TODO this is probably broken in terms of state propagation
    this.fluxClone.query.withConfiguration(<QueryConfiguration>{ refinements: [] });
    if (searchRequest.refinements) {
      const filteredRefinements = searchRequest.refinements.filter(({ navigationName }) => !this.isTargetNav(navigationName));
      this.fluxClone.query.withSelectedRefinements(...filteredRefinements);
    }

    this.fluxClone.search(searchRequest.query).then(this.updateValues);
  }

  navigate(value) {
    if (this.selected) this.parentOpts.flux.unrefine(this.selected, { skipSearch: true });
    if (value === '*') {
      this.parentOpts.flux.reset();
    } else {
      this.parentOpts.flux.refine(this.selected = toRefinement(value, { name: this.navField }));
    }
  }
}
