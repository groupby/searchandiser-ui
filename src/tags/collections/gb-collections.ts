import { COLLECTIONS_UPDATED_EVENT } from '../../services/collections';
import { checkBooleanAttr } from '../../utils/common';
import { Selectable } from '../select/gb-select';
import { FluxTag } from '../tag';

export interface CollectionOption {
  label: string;
  value: string;
}

export interface CollectionsConfig extends Selectable {
  items: Array<string | CollectionOption>;
  dropdown?: boolean;
  showCounts?: boolean;
}

export interface Collections extends FluxTag<any>, Selectable { }

export class Collections {
  dropdown: boolean;
  showCounts: boolean;

  counts: { [key: string]: number };
  labels: { [key: string]: string };

  init() {
    this.alias(['collections', 'listable', 'selectable']);

    this.showCounts = checkBooleanAttr('showCounts', this.opts, true);
    this.dropdown = checkBooleanAttr('dropdown', this.opts);

    const collectionsService = this.services.collections;
    this.items = collectionsService.items;
    this.labels = collectionsService.isLabeled ? this.items.reduce(this.extractLabels, {}) : {};
    this.counts = {};

    this.flux.on(COLLECTIONS_UPDATED_EVENT, this.updateCounts);
  }

  updateCounts(counts: any) {
    this.update({ counts });
  }

  switchCollection(event: MouseEvent) {
    let element = <HTMLElement>event.target;
    while (element.tagName !== 'A') {
      element = element.parentElement;
    }
    this.onSelect(element.dataset['collection']);
  }

  onSelect(collection: string) {
    this.flux.switchCollection(collection);
  }

  extractLabels(labels: any, collection: { value: string; label: string; }) {
    return Object.assign(labels, { [collection.value]: collection.label });
  }
}
