import { COLLECTIONS_UPDATED_EVENT } from '../../services/collections';
import { meta } from '../../utils/decorators';
import { Selectable, SelectOption, SelectTag } from '../select/gb-select';
import { TagMeta } from '../tag';

export interface CollectionsOpts extends Selectable {
  items: SelectOption[];
  dropdown?: boolean;
  showCounts?: boolean;
}

export const META: TagMeta = {
  defaults: {
    items: [],
    showCounts: true
  },
  types: {
    showCounts: 'boolean',
    dropdown: 'boolean'
  },
  services: ['collections']
};

@meta(META)
export class Collections extends SelectTag<CollectionsOpts> {

  dropdown: boolean;
  showCounts: boolean;

  counts: { [key: string]: number };

  init() {
    this.expose(['collections', 'listable', 'selectable']);

    this.flux.on(COLLECTIONS_UPDATED_EVENT, this.updateCounts);
  }

  setDefaults() {
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
