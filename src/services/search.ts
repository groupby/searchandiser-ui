import { SearchandiserConfig } from '../searchandiser';
import { Services } from './init';
import { FluxCapacitor } from 'groupby-api';

export const SEARCH_RESET_EVENT = 'search:reset';

export class Search {

  constructor(private flux: FluxCapacitor, private config: SearchandiserConfig, private services: Services) {
  }

  init() {
    this.flux.on(SEARCH_RESET_EVENT, (newQuery) => this.reset(newQuery));
  }

  reset(newQuery: string) {
    return this.flux.reset(newQuery)
      .then(() => this.services.tracker && this.services.tracker.search());
  }
}
