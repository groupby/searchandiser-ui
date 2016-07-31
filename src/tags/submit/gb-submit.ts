import riot = require('riot');
import { FluxTag } from '../tag';
import { unless, updateLocation, findTag } from '../../utils';

export interface Submit extends FluxTag {
  root: HTMLInputElement & riot.TagElement;
}

export class Submit {

  searchBox: HTMLInputElement;
  searchUrl: string;
  queryParam: string;
  staticSearch: boolean;

  init() {
    const label = this.opts.label || 'Search';
    this.staticSearch = unless(this.opts.staticSearch, false);
    this.queryParam = this.opts.queryParam || 'q';
    this.searchUrl = this.opts.searchUrl || 'search';

    if (this.root.tagName === 'INPUT') this.root.value = label;

    this.on('mount', () => this.searchBox = <HTMLInputElement>findTag('gb-raw-query'));

    this.root.addEventListener('click', this.clickHandler);
  }

  clickHandler() {
    const inputValue = this.searchBox.value;

    if (this.staticSearch && window.location.pathname !== this.searchUrl) {
      updateLocation(this.searchUrl, this.queryParam, inputValue, []);
    } else {
      this.opts.flux.reset(inputValue);
    }
  }
}
