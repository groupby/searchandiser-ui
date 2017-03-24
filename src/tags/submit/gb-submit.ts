import { SEARCH_RESET_EVENT } from '../../services/search';
import { findSearchBox } from '../../utils/common';
import { meta } from '../../utils/decorators';
import { FluxTag, TagMeta } from '../tag';
import * as riot from 'riot';

export interface SubmitOpts {
  label?: string;
}

export const META: TagMeta = {
  defaults: {
    label: 'Search'
  }
};

@meta(META)
export class Submit extends FluxTag<SubmitOpts> {
  root: riot.TagElement & { value: any };

  label: string;

  searchBox: HTMLInputElement;

  init() {
    this.on('mount', this.setSearchBox);
    this.root.addEventListener('click', this.submitQuery);
  }

  setDefaults() {
    if (this.root.tagName === 'INPUT') {
      this.root.value = this.label;
    }
  }

  setSearchBox() {
    this.searchBox = findSearchBox();
  }

  submitQuery() {
    this.flux.emit(SEARCH_RESET_EVENT, this.searchBox.value);
  }
}
