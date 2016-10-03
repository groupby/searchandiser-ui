import { COLLECTIONS_UPDATED_EVENT } from '../../services/collections';
import { getPath, unless } from '../../utils/common';
import { FluxTag } from '../tag';

export interface CollectionOption {
  label: string;
  value: string;
}

export interface CollectionsConfig {
  options: string[] | CollectionOption[];
  counts?: boolean;
  dropdown?: boolean;
}

export interface Collections extends FluxTag { }

export class Collections {

  _config: CollectionsConfig;
  collections: string[];
  counts: any;
  labels: any;
  fetchCounts: boolean;
  dropdown: boolean;

  init() {
    this._config = Object.assign({ options: [] }, getPath(this.config, 'tags.collections'), this.opts);
    const collectionsService = this.services.collections;
    this.collections = collectionsService.collections;
    this.fetchCounts = collectionsService.fetchCounts;
    this.labels = collectionsService.isLabeled
      ? (<CollectionOption[]>this._config.options).reduce(this.extractLabels, {})
      : {};
    this.dropdown = unless(this._config.dropdown, false);

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
