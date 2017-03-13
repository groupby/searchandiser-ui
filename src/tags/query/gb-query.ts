import { findTag } from '../../utils/common';
import { meta } from '../../utils/decorators';
import { AUTOCOMPLETE_HIDE_EVENT } from '../sayt/autocomplete';
import { Sayt } from '../sayt/gb-sayt';
import { FluxTag, TagMeta } from '../tag';
import { Events } from 'groupby-api';
import * as riot from 'riot';

const KEY_ENTER = 13;

export interface QueryOpts {
  sayt?: boolean;
  autoSearch?: boolean;
  staticSearch?: boolean;
}

export const META: TagMeta = {
  defaults: {
    sayt: true,
    autoSearch: true
  },
  types: {
    sayt: 'boolean',
    autoSearch: 'boolean',
    staticSearch: 'boolean'
  }
};

@meta(META)
export class Query extends FluxTag<QueryOpts> {
  root: riot.TagElement & HTMLInputElement;
  tags: {
    'gb-sayt': Sayt;
    'gb-search-box': FluxTag<any> & {
      refs: { searchBox: HTMLInputElement };
    };
  };

  sayt: boolean;
  autoSearch: boolean;
  staticSearch: boolean;

  searchBox: HTMLInputElement;
  enterKeyHandlers: Function[];

  init() {
    this.on('mount', this.attachListeners);
    this.flux.on(Events.REWRITE_QUERY, this.rewriteQuery);
  }

  setDefaults() {
    this.enterKeyHandlers = [];
  }

  attachListeners() {
    this.searchBox = this.findSearchBox();
    this.searchBox.addEventListener('keydown', this.keydownListener);
    if (this.sayt) {
      this.tags['gb-sayt'].listenForInput(this);
    }

    if (this.autoSearch) {
      this.listenForInput();
    } else if (this.staticSearch) {
      this.listenForStaticSearch();
    } else {
      this.listenForSubmit();
    }
  }

  rewriteQuery(query: string) {
    this.searchBox.value = query;
  }

  listenForInput() {
    this.searchBox.addEventListener('input', this.resetToInputValue);
  }

  listenForSubmit() {
    this.enterKeyHandlers.push(this.resetToInputValue);
  }

  resetToInputValue() {
    return this.flux.reset(this.inputValue())
      .then(() => this.services.tracker && this.services.tracker.search());
  }

  listenForStaticSearch() {
    this.enterKeyHandlers.push(this.setLocation);
  }

  keydownListener(event: KeyboardEvent) {
    const sayt = findTag('gb-sayt');
    if (sayt) {
      const autocomplete = (<Sayt>sayt._tag).autocomplete;
      autocomplete.keyboardListener(event, this.onSubmit);
    } else if (event.keyCode === KEY_ENTER) {
      this.onSubmit();
    }
  }

  onSubmit() {
    this.enterKeyHandlers.forEach((f) => f());
    this.flux.emit(AUTOCOMPLETE_HIDE_EVENT);
  }

  findSearchBox() {
    if (this.tags['gb-search-box']) {
      return this.tags['gb-search-box'].refs.searchBox;
    } else {
      return this.root.querySelector('input');
    }
  }

  setLocation() {
    if (this.services.url.isActive()) {
      this.services.url.update(this.flux.query.withQuery(this.inputValue())
        .withConfiguration(<any>{ refinements: [] }));
    } else {
      this.flux.reset(this.inputValue());
    }
  }

  inputValue() {
    return this.searchBox.value;
  }
}
