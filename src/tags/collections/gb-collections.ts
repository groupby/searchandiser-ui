import { COLLECTIONS_UPDATED_EVENT } from '../../services/collections';
import { checkBooleanAttr } from '../../utils/common';
import { Selectable } from '../select/gb-select';
import { FluxTag } from '../tag';

export interface CollectionOption {
  label: string;
  value: string;
}

export interface CollectionsConfig extends Selectable {
  items: string[] | CollectionOption[];
  dropdown?: boolean;
  showCounts?: boolean;
}

export interface Collections extends FluxTag<any>, Selectable { }

export class Collections {
  dropdown: boolean;
  showCounts: boolean;

  counts: { [key: string]: number };

  init() {
    this.alias(['collections', 'listable', 'selectable']);

    this.showCounts = checkBooleanAttr('showCounts', this.opts, true);
    this.dropdown = checkBooleanAttr('dropdown', this.opts);

    this.items = this.services.collections.items;
    this.counts = {};

    this.flux.on(COLLECTIONS_UPDATED_EVENT, this.updateCounts);
  }

  updateCounts(counts: any) {
    this.update({ counts });
  }

  switchCollection({ currentTarget}: { currentTarget: HTMLAnchorElement }) {
    this.onSelect(currentTarget.dataset['collection']);
  }

  onSelect(collection: string) {
    this.flux.switchCollection(collection);
  }
}
