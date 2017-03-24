import { SearchandiserConfig } from '../searchandiser';
import { Services } from './init';
import { FluxCapacitor } from 'groupby-api';

export const RESET_EVENT = 'search:reset';
export const REFINE_EVENT = 'search:refine';

export class Search {

  constructor(private flux: FluxCapacitor, private config: SearchandiserConfig, private services: Services) {
  }

  init() {
    this.flux.on(RESET_EVENT, (newQuery) => this.reset(newQuery));
    this.flux.on(REFINE_EVENT, (newQuery) => this.refine(newQuery));
  }

  reset(newQuery: string) {
    return this.flux.reset(newQuery)
      .then(() => this.services.tracker && this.services.tracker.search());
  }

  refine([newQuery, refinement]: [string, any]) {
    return this.flux.rewrite(newQuery, { skipSearch: !!refinement })
      .then(() => refinement ? this.flux.refine(refinement) : Promise.resolve())
      .then(() => this.services.tracker && this.services.tracker.sayt());
  }
}
