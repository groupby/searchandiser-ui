import { FluxTag } from '../tag';
import { Events } from 'groupby-api';
import { unless, getPath } from '../../utils';

export interface Collections extends FluxTag { }

export class Collections {

  options: any[];
  collections: string[];
  counts: any;
  labels: any;
  fetchCounts: boolean;
  dropdown: boolean;

  init() {
    const config = Object.assign({}, getPath(this.config, 'tags.collections'), this.opts);
    this.options = unless(config.options, []);
    const isLabeledCollections = this.options.length !== 0 && typeof this.options[0] === 'object';
    this.collections = isLabeledCollections ? this.options.map((collection) => collection.value) : this.options;
    this.labels = isLabeledCollections ? this.options.reduce((labels, collection) => Object.assign(labels, { [collection.value]: collection.label }), {}) : {};
    this.fetchCounts = unless(config.counts, true);
    this.dropdown = unless(config.dropdown, false);
    this.flux.on(Events.REQUEST_CHANGED, this.updateCollectionCounts);
    this.updateCollectionCounts();
  }

  switchCollection(event: MouseEvent) {
    let element = <HTMLElement>event.target;
    while (element.tagName !== 'A') element = element.parentElement;
    this.onselect(element.dataset['collection']);
  }

  onselect(collection: string) {
    this.flux.switchCollection(collection);
  }

  updateCollectionCounts() {
    if (this.fetchCounts) {
      const searches = this.collections.map((collection) => this.flux.bridge
        .search(Object.assign(this.flux.query.raw, { collection }))
        .then((results) => ({ results, collection })));

      Promise.all(searches)
        .then((res) => res.reduce((counts, { results, collection }) => Object.assign(counts, { [collection]: results.totalRecordCount }), {}))
        .then((counts) => this.update({ counts }));
    }
  }

  selected(collection: string) {
    return collection === this.flux.query.raw.collection;
  }
}
