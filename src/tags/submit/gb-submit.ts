import { checkBooleanAttr, findSearchBox } from '../../utils/common';
import { FluxTag } from '../tag';
import * as riot from 'riot';

export interface SubmitConfig {
  label?: string;
  staticSearch?: boolean;
}

export class Submit extends FluxTag<any> {
  root: riot.TagElement & { value: any };

  label: string;
  staticSearch: boolean;

  searchBox: HTMLInputElement;

  init() {
    this.label = this.opts.label || 'Search';
    this.staticSearch = checkBooleanAttr('staticSearch', this.opts);

    if (this.root.tagName === 'INPUT') {
      this.root.value = this.label;
    }

    this.on('mount', this.setSearchBox);
    this.root.addEventListener('click', this.submitQuery);
  }

  setSearchBox() {
    this.searchBox = findSearchBox();
  }

  submitQuery() {
    const inputValue = this.searchBox.value;

    if (this.staticSearch && this.services.url.isActive()) {
      const query = this.flux.query.withQuery(inputValue)
        .withConfiguration(<any>{ refinements: [] });
      return Promise.resolve(this.services.url.update(query));
    } else {
      return this.flux.reset(inputValue)
        .then(() => this.services.tracker && this.services.tracker.search());
    }
  }
}
