import { COLLECTIONS_UPDATED_EVENT } from '../../services/collections';
import { Selectable, SelectOption, SelectTag } from '../select/gb-select';
import { TagConfigure } from '../tag';

export interface CollectionsOpts extends Selectable {
  items: SelectOption[];
  dropdown?: boolean;
  showCounts?: boolean;
}

export const DEFAULTS = {
  items: [],
  showCounts: true
};
export const TYPES = {
  showCounts: 'boolean',
  dropdown: 'boolean'
};
export const SERVICES = ['collections'];

export class Collections extends SelectTag<CollectionsOpts> {
  dropdown: boolean;
  showCounts: boolean;

  counts: { [key: string]: number };

  init() {
    this.expose(['collections', 'listable', 'selectable']);

    this.flux.on(COLLECTIONS_UPDATED_EVENT, this.updateCounts);
  }

  onConfigure(configure: TagConfigure) {
    configure({ defaults: DEFAULTS, types: TYPES, services: SERVICES });

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
