import { findSearchBox, unless, updateLocation } from '../../utils';
import { FluxTag } from '../tag';

export interface Submit extends FluxTag {
  root: HTMLElement & { value: any };
}

export class Submit {

  searchBox: HTMLInputElement;
  label: string;
  searchUrl: string;
  queryParam: string;
  staticSearch: boolean;

  init() {
    this.label = this.opts.label || 'Search';
    this.staticSearch = unless(this.opts.staticSearch, false);
    this.queryParam = this.opts.queryParam || 'q';
    this.searchUrl = this.opts.searchUrl || 'search';

    if (this.root.tagName === 'INPUT') this.root.value = this.label;

    this.on('mount', this.setSearchBox);

    this.root.addEventListener('click', this.submitQuery);
  }

  setSearchBox() {
    this.searchBox = findSearchBox();
  }

  submitQuery() {
    const inputValue = this.searchBox.value;

    if (this.staticSearch && window.location.pathname !== this.searchUrl) {
      updateLocation(this.searchUrl, this.queryParam, inputValue, []);
    } else {
      this.flux.reset(inputValue);
    }
  }
}
