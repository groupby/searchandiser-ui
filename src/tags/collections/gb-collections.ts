import { getPath, unless } from '../../utils';
import { FluxTag } from '../tag';
import { Events, Results } from 'groupby-api';

export type CancelablePromise<T> = Promise<T> & { cancelled: boolean; };

export interface Collections extends FluxTag { }

export class Collections {

  options: any[];
  collections: string[];
  counts: any;
  labels: any;
  fetchCounts: boolean;
  dropdown: boolean;
  inProgress: CancelablePromise<any>;

  init() {
    const config = Object.assign({}, getPath(this.config, 'tags.collections'), this.opts);
    this.options = unless(config.options, []);
    const isLabeledCollections = this.options.length !== 0 && typeof this.options[0] === 'object';
    this.collections = isLabeledCollections ? this.options.map((collection) => collection.value) : this.options;
    this.labels = isLabeledCollections ? this.options.reduce(this.extractLabels, {}) : {};
    this.fetchCounts = unless(config.counts, true);
    this.dropdown = unless(config.dropdown, false);
    this.flux.on(Events.QUERY_CHANGED, this.updateCollectionCounts);
    this.flux.on(Events.RESULTS, this.updateSelectedCollectionCount);
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

  updateCollectionCounts(query: string = '') {
    if (this.fetchCounts) {
      if (this.inProgress) {
        this.inProgress.cancelled = true;
      }

      const searches = this.collections
        .filter((collection) => !this.selected(collection))
        .map((collection) => this.flux.bridge
          .search(Object.assign(this.flux.query.raw, { query, collection, refinements: [], pageSize: 0, fields: '' }))
          .then((results) => ({ results, collection })));

      const promises = this.inProgress = <CancelablePromise<any>>Promise.all(searches);

      promises
        .then((res) => res.reduce(this.extractCounts, {}))
        .then((counts) => {
          if (!promises.cancelled) {
            this.update({ counts: Object.assign({}, this.counts, counts) });
          }
        });
    }
  }

  updateSelectedCollectionCount(res: Results) {
    const selectedCollection = this.flux.query.raw.collection;
    const counts = Object.assign({}, this.counts, { [selectedCollection]: res.totalRecordCount });
    this.update({ counts });
  }

  selected(collection: string) {
    return collection === this.flux.query.raw.collection;
  }

  private extractCounts(counts: any, { results, collection }: { results: Results, collection: string }) {
    return Object.assign(counts, { [collection]: results.totalRecordCount });
  }

  private extractLabels(labels: any, collection: { value: string; label: string; }) {
    return Object.assign(labels, { [collection.value]: collection.label });
  }
}
