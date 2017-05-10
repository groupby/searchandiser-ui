import { findSearchBox } from '../../utils/common';
import { meta } from '../../utils/decorators';
import { FluxTag, TagMeta } from '../tag';
import * as riot from 'riot';

export interface SubmitOpts {
  label?: string;
  staticSearch?: boolean;
}

export const META: TagMeta = {
  defaults: {
    label: 'Search'
  },
  types: {
    staticSearch: 'boolean'
  }
};

@meta(META)
export class Submit extends FluxTag<SubmitOpts> {
  root: riot.TagElement & HTMLInputElement;

  label: string;
  staticSearch: boolean;

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
