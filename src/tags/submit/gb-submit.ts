import { findSearchBox } from '../../utils/common';
import { FluxTag } from '../tag';
import { Query } from 'groupby-api';
import * as riot from 'riot';

export interface SubmitConfig {
  label?: string;
  staticSearch?: boolean;
}

export const DEFAULT_CONFIG: SubmitConfig = {
  label: 'Search',
  staticSearch: false
};

export interface Submit extends FluxTag<SubmitConfig> {
  root: riot.TagElement & { value: any };
}

export class Submit {

  searchBox: HTMLInputElement;

  init() {
    this.configure(DEFAULT_CONFIG);

    if (this.root.tagName === 'INPUT') {
      this.root.value = this._config.label;
    }

    this.on('mount', this.setSearchBox);
    this.root.addEventListener('click', this.submitQuery);
  }

  setSearchBox() {
    this.searchBox = findSearchBox();
  }

  submitQuery() {
    const inputValue = this.searchBox.value;

    if (this._config.staticSearch && this.services.url.isActive()) {
      this.services.url.update(this.flux.query.withQuery(inputValue));
    } else {
      this.flux.reset(inputValue)
        .then(() => this.services.tracker.search());
    }
  }
}
