import { RESET_EVENT } from '../../services/search';
import { riot } from '../../utils/common';
import { meta } from '../../utils/decorators';
import { AUTOCOMPLETE_HIDE_EVENT } from '../sayt/autocomplete';
import { Sayt } from '../sayt/gb-sayt';
import { FluxTag, TagMeta } from '../tag';
import { Events } from 'groupby-api';

const ENTER_KEY = 13;

export interface QueryOpts {
  sayt?: boolean;
  autoSearch?: boolean;
}

export const META: TagMeta = {
  defaults: {
    sayt: true,
    autoSearch: true
  },
  types: {
    sayt: 'boolean',
    autoSearch: 'boolean'
  }
};

@meta(META)
export class Query extends FluxTag<QueryOpts> {
  tags: {
    'gb-sayt': Sayt;
    'gb-search-box': FluxTag<any> & {
      refs: { searchBox: HTMLInputElement };
    };
  };

  sayt: boolean;
  autoSearch: boolean;

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
    } else {
      this.listenForSubmit();
    }
  }

  rewriteQuery(query: string) {
    this.searchBox.value = query;
  }

  listenForInput() {
    this.searchBox.addEventListener('input', this.updateQuery);
  }

  listenForSubmit() {
    this.enterKeyHandlers.push(this.updateQuery);
  }

  updateQuery() {
    this.flux.emit(RESET_EVENT, this.inputValue());
  }

  keydownListener(event: KeyboardEvent) {
    if (this.sayt) {
      const autocomplete = this.tags['gb-sayt'].autocomplete;
      autocomplete.keyboardListener(event, this.onSubmit);
    } else if (event.keyCode === ENTER_KEY) {
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

  inputValue() {
    return this.searchBox.value;
  }
}
