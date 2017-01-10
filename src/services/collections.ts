import { SearchandiserConfig } from '../searchandiser';
import { CollectionsConfig, CollectionOption } from '../tags/collections/gb-collections';
import { getPath, unless } from '../utils/common';
import { Events, FluxCapacitor, Results } from 'groupby-api';

export const COLLECTIONS_UPDATED_EVENT = 'collections_updated';

export type CancelablePromise<T> = Promise<T> & { cancelled: boolean; };

export class Collections {

  collectionsConfig: CollectionsConfig;
  fetchCounts: boolean;
  isLabeled: boolean;
  counts: any = {};
  inProgress: CancelablePromise<any>;
  collections: string[];
  items: Array<string | CollectionOption>;

  constructor(private flux: FluxCapacitor, private config: SearchandiserConfig) {
    this.collectionsConfig = getPath(config, 'tags.collections') || {};
    this.fetchCounts = unless(this.collectionsConfig.showCounts, true);
    this.items = this.collectionsConfig.items || [];
    this.isLabeled = this.items.length !== 0
      && typeof this.items[0] === 'object';
    this.collections = this.isLabeled
      ? (<CollectionOption[]>this.items).map((collection) => collection.value)
      : <string[]>this.items;
  }

  init() {
    this.flux.on(Events.QUERY_CHANGED, (query) => this.updateCollectionCounts(query));
    this.flux.on(Events.RESULTS, (results) => this.updateSelectedCollectionCount(results));
    this.updateCollectionCounts();
  }

  updateCollectionCounts(query: string = '') {
    if (this.fetchCounts) {
      if (this.inProgress) {
        this.inProgress.cancelled = true;
      }

      const searches = this.collections
        .filter((collection) => !this.isSelected(collection))
        .map((collection) => this.flux.bridge
          .search(Object.assign(this.flux.query.raw, { query, collection, refinements: [], pageSize: 0, fields: '' }))
          .then((results) => ({ results, collection })));

      const promises = this.inProgress = <CancelablePromise<any>>Promise.all(searches);

      return promises.then(this.extractCounts)
        .then((counts) => {
          if (!promises.cancelled) {
            Object.assign(this.counts, counts);
            this.flux.emit(COLLECTIONS_UPDATED_EVENT, this.counts);
          }
        });
    }
  }

  extractCounts(res: any[]) {
    return res.reduce((counts, { results, collection }) =>
      Object.assign(counts, { [collection]: results.totalRecordCount }), {});
  }

  updateSelectedCollectionCount(res: Results) {
    Object.assign(this.counts, { [this.selectedCollection]: res.totalRecordCount });
    this.flux.emit(COLLECTIONS_UPDATED_EVENT, this.counts);
  }

  isSelected(collection: string) {
    return collection === this.selectedCollection;
  }

  get selectedCollection() {
    return getPath(this.flux, 'query.raw.collection') || this.config.collection;
  }

  // private extractCounts(counts: any, { results, collection }: { results: Results, collection: string }) {
  //   return Object.assign(counts, { [collection]: results.totalRecordCount });
  // }
}
