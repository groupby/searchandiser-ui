import { CONFIGURATION_MASK, SearchandiserConfig } from '../searchandiser';
import { FilterConfig } from '../tags/filter/gb-filter';
import { getPath } from '../utils/common';
import { Events, FluxCapacitor } from 'groupby-api';

export const FILTER_UPDATED_EVENT = 'filter_updated';

export class Filter {

  filterConfig: FilterConfig;
  fluxClone: FluxCapacitor;

  constructor(private flux: FluxCapacitor, private config: SearchandiserConfig) {
    this.fluxClone = this.clone();
    this.filterConfig = getPath(config, 'tags.filter') || {};
  }

  init() {
    this.flux.on(Events.RESULTS, () => this.updateFluxClone());
  }

  updateFluxClone() {
    const searchRequest = this.flux.query.raw;
    // TODO: this is probably broken in terms of state propagation
    this.fluxClone.query.withConfiguration(<any>{ refinements: [] });
    if (searchRequest.refinements) {
      const filteredRefinements: any[] = searchRequest.refinements
        .filter(({ navigationName }) => !this.isTargetNav(navigationName));
      this.fluxClone.query.withSelectedRefinements(...filteredRefinements);
    }

    this.fluxClone.search(searchRequest.query)
      .then((res) => this.flux.emit(FILTER_UPDATED_EVENT, res));
  }

  isTargetNav(navName: string) {
    return navName === this.filterConfig.field;
  }

  clone() {
    return new FluxCapacitor(this.config.customerId, this.config, CONFIGURATION_MASK);
  }
}
