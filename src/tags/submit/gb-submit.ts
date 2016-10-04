import { findSearchBox, unless } from '../../utils/common';
import { FluxTag } from '../tag';
import * as riot from 'riot';

export interface Submit extends FluxTag {
  root: riot.TagElement & { value: any };
}

export class Submit {

  searchBox: HTMLInputElement;
  label: string;
  staticSearch: boolean;

  init() {
    this.label = this.opts.label || 'Search';
    this.staticSearch = unless(this.opts.staticSearch, false);

    if (this.root.tagName === 'INPUT') this.root.value = this.label;

    this.on('mount', this.setSearchBox);

    this.root.addEventListener('click', this.submitQuery);
  }

  setSearchBox() {
    this.searchBox = findSearchBox();
  }

  submitQuery() {
    const inputValue = this.searchBox.value;

    if (this.staticSearch && this.services.url.active()) {
      this.services.url.update(inputValue, []);
    } else {
      this.flux.reset(inputValue);
    }
  }
}
