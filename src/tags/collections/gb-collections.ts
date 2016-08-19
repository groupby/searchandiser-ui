import { FluxTag } from '../tag';
import { Events } from 'groupby-api';
import { unless, getPath } from '../../utils';

export interface Collections extends FluxTag { }

export class Collections {

  collections: string[];
  counts: any;
  labels: any;
  fetchCounts: boolean;

  init() {
    const config = Object.assign({}, getPath(this.config, 'tags.collections'), this.opts);
    const rawCollections = unless(config.options, []);
    const isLabeledCollections = rawCollections.length !== 0 && typeof rawCollections[0] === 'object';
    this.collections = isLabeledCollections ? rawCollections.map((collection) => collection.value) : rawCollections;
    this.labels = isLabeledCollections ? rawCollections.reduce((labels, collection) => Object.assign(labels, { [collection.value]: collection.label }), {}) : {};
    this.fetchCounts = unless(config.counts, true);
    this.flux.on(Events.REQUEST_CHANGED, this.updateCollectionCounts);
    this.updateCollectionCounts();
  }

  switchCollection(event: MouseEvent) {
    let element = <HTMLElement>event.target;
    while (element.tagName !== 'A') element = element.parentElement;
    this.flux.switchCollection(element.dataset['collection']);
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
