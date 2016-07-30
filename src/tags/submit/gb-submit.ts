import { FluxTag } from '../tag';
import { unless, updateLocation } from '../../utils';

export interface Submit extends FluxTag {
  root: HTMLInputElement;
}

export class Submit {
  init() {
    const label = this.opts.label || 'Search';
    const staticSearch = unless(this.opts.staticSearch, false);
    const queryParam = this.opts.queryParam || 'q';
    const searchUrl = this.opts.searchUrl || 'search';

    if (this.root.tagName === 'INPUT') this.root.value = label;

    this.root.addEventListener('click', () => {
      const inputValue = (<HTMLInputElement>document.querySelector('[riot-tag="gb-raw-query"]')).value;

      if (staticSearch && window.location.pathname !== searchUrl) {
        updateLocation(searchUrl, queryParam, inputValue, []);
      } else {
        this.opts.flux.reset(inputValue);
      }
    });
  }
}
