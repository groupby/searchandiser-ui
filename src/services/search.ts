import { Events, FluxCapacitor } from 'groupby-api';

export class Search {

  constructor(private flux: FluxCapacitor) { }

  init() {
    this.flux.on(Events.SEARCH_CHANGED, () => this.fetchProducts());
  }

  fetchProducts() {
    this.flux.actions.fetchProducts();
  }

  // emit(event: string) {
  //   if (this.services.tracker) {
  //     switch (typeof event) {
  //       case 'string': return this.services.tracker[event]
  //         ? this.services.tracker[event]()
  //         : this.services.tracker.sendSearchEvent(event);
  //       default: return console.error('event must be a string');
  //     }
  //   }
  // }
}
