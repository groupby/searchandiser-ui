import { COLLECTIONS_UPDATED_EVENT } from '../../services/collections';
import { Selectable, SelectTag } from '../select/gb-select';
import { TagConfigure } from '../tag';

export interface CollectionOption {
  label: string;
  value: string;
}

export interface CollectionsConfig extends Selectable {
  items: string[] | CollectionOption[];
  dropdown?: boolean;
  showCounts?: boolean;
}

export const DEFAULTS = {
  showCounts: true
};
export const TYPES = {
  showCounts: 'boolean',
  dropdown: 'boolean'
};

export class Collections extends SelectTag<any> {
  dropdown: boolean;
  showCounts: boolean;

  counts: { [key: string]: number };

  init() {
    this.expose(['collections', 'listable', 'selectable']);

    this.flux.on(COLLECTIONS_UPDATED_EVENT, this.updateCounts);
  }

  onConfigure(configure: TagConfigure) {
    configure({ defaults: DEFAULTS, types: TYPES });

    // TODO: extract items into services.collections._config
    this.items = this.services.collections.items;
    this.counts = {};
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
