import { Events, FluxCapacitor } from 'groupby-api';
import { SearchandiserConfig } from '../searchandiser';
import { FilterOpts } from '../tags/filter/gb-filter';
import { getPath } from '../utils/common';
import { lazyMixin, LazyInitializer, LazyService, Services } from './init';

export const FILTER_UPDATED_EVENT = 'filter_updated';

export interface Filter extends LazyService { }

export class Filter implements LazyInitializer {

  // filterConfig: FilterOpts;
  // fluxClone: FluxCapacitor;
  //
  // constructor(private flux: FluxCapacitor, private config: SearchandiserConfig, private services: Services) {
  //   lazyMixin(this);
  //   this.filterConfig = getPath(config, 'tags.filter') || {};
  // }
  //
  init() {
    //   this.fluxClone = this.clone();
  }
  //
  lazyInit() {
    //   this.flux.on(Events.RESULTS, () => this.updateFluxClone());
    //   this.updateFluxClone();
  }
  //
  // updateFluxClone() {
  //   const searchRequest = this.flux.query.raw;
  //   // TODO: this is probably broken in terms of state propagation
  //   this.fluxClone.query.withConfiguration(<any>{ refinements: [] });
  //   if (searchRequest.refinements) {
  //     const filteredRefinements: any[] = searchRequest.refinements
  //       .filter(({ navigationName }) => !this.isTargetNav(navigationName));
  //     this.fluxClone.query.withSelectedRefinements(...filteredRefinements);
  //   }
  //
  //   return this.fluxClone.search(searchRequest.query)
  //     .then((res) => this.flux.emit(FILTER_UPDATED_EVENT, res));
  // }
  //
  // isTargetNav(navName: string) {
  //   return navName === this.filterConfig.field;
  // }
  //
  // clone() {
  //   return new FluxCapacitor(this.config.customerId, this.services.search._config);
  // }
}
