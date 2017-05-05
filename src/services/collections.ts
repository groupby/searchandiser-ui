import { Events, FluxCapacitor } from 'groupby-api';
import { lazyMixin, LazyInitializer, LazyService } from '.';
import { StoreFront } from '../searchandiser';

export interface Opts {
  fetchCounts?: boolean;
}

export const DEFAULTS: Opts = {
  fetchCounts: true
};

export interface Collections extends LazyService { }

export class Collections implements LazyInitializer {

  opts: Opts;

  constructor(private flux: FluxCapacitor, private config: StoreFront.Config) {
    lazyMixin(this);
    this.opts = { ...DEFAULTS, ...(this.config.services.collections || {}) };
  }

  init() {
    // lazy service
  }

  lazyInit() {
    if (this.opts.fetchCounts) {
      this.flux.on(Events.RECALL_CHANGED, () =>
        this.flux.once(Events.FETCH_SEARCH_DONE, () =>
          this.fetchCollectionCounts()));
    }
  }

  fetchCollectionCounts() {
    this.flux.store.getState()
      .data.collections.allIds.forEach((collection) =>
        this.flux.store.dispatch<any>(this.flux.actions.fetchCollectionCount(collection)));
  }
}
