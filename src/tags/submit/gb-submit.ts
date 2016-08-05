import { FluxTag } from '../tag';
import { unless, updateLocation, findTag } from '../../utils';

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

    this.on('mount', this.findSearchBox);

    this.root.addEventListener('click', this.submitQuery);
  }

  findSearchBox() {
    this.searchBox = <HTMLInputElement>findTag('gb-raw-query');
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
