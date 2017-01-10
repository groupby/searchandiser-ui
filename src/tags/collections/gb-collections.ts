import { COLLECTIONS_UPDATED_EVENT } from '../../services/collections';
import { checkBooleanAttr } from '../../utils/common';
import { Selectable } from '../select/gb-select';
import { FluxTag } from '../tag';

export interface CollectionOption {
  label: string;
  value: string;
}

export interface CollectionsConfig extends Selectable {
  options: string[] | CollectionOption[];
  counts?: boolean;
  dropdown?: boolean;
}

export const DEFAULT_CONFIG: CollectionsConfig = {
  options: [],
  counts: true,
  dropdown: false
};

export interface Collections extends FluxTag<any>, Selectable { }

export class Collections {
  options: string[] | CollectionOption[];
  counts: {[key: string]: number};
  dropdown: boolean;

  collections: string[];
  labels: {[key: string]: string};

  init() {
    this.options = this.opts.options || [];
    this.counts = checkBooleanAttr('counts', this.opts, true);
    this.dropdown = checkBooleanAttr('dropdown', this.opts);

    const collectionsService = this.services.collections;
    this.collections = collectionsService.collections;
    this.labels = collectionsService.isLabeled
      ? (<CollectionOption[]>this._config.options).reduce(this.extractLabels, {})
      : {};

    this.flux.on(COLLECTIONS_UPDATED_EVENT, this.updateCounts);
  }

  updateCounts(counts: any) {
    this.update({ counts });
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
