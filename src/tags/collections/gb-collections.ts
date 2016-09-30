import { COLLECTIONS_UPDATED_EVENT } from '../../services/collections';
import { SelectConfig, SelectTag } from '../select/gb-select';

export interface CollectionOption {
  label: string;
  value: string;
}

export interface CollectionsConfig extends SelectConfig {
  options: string[] | CollectionOption[];
  counts?: boolean;
  dropdown?: boolean;
}

export const DEFAULT_CONFIG: CollectionsConfig = {
  options: [],
  counts: true,
  dropdown: false
};

export interface Collections extends SelectTag<CollectionsConfig> { }

export class Collections {

  collections: string[];
  counts: any;
  labels: any;
  fetchCounts: boolean;

  init() {
    this.configure(DEFAULT_CONFIG);

    this.options = this._config.options;
    const collectionsService = this.services.collections;
    this.collections = collectionsService.collections;
    this.fetchCounts = collectionsService.fetchCounts;
    this.labels = collectionsService.isLabeled
      ? (<CollectionOption[]>this._config.options).reduce(this.extractLabels, {})
      : {};

    this.flux.on(COLLECTIONS_UPDATED_EVENT, (counts) => this.update({ counts }));
  }

  switchCollection(event: MouseEvent) {
    let element = <HTMLElement>event.target;
    while (element.tagName !== 'A') element = element.parentElement;
    this.onselect(element.dataset['collection']);
  }

  onselect(collection: string) {
    this.flux.switchCollection(collection);
  }

  private extractLabels(labels: any, collection: { value: string; label: string; }) {
    return Object.assign(labels, { [collection.value]: collection.label });
  }
}
