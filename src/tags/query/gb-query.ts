import { findTag } from '../../utils/common';
import { Sayt } from '../sayt/gb-sayt';
import '../sayt/gb-sayt.tag.html';
import { FluxTag } from '../tag';
import { Events } from 'groupby-api';
import * as riot from 'riot';

const KEY_ENTER = 13;

export interface QueryConfig {
  sayt?: boolean;
  autoSearch?: boolean;
  staticSearch?: boolean;
}

export const DEFAULT_CONFIG: QueryConfig = {
  sayt: true,
  autoSearch: true,
  staticSearch: false
};

export interface Query extends FluxTag<QueryConfig> {
  root: riot.TagElement & HTMLInputElement;
}

export class Query {

  searchBox: HTMLInputElement;
  enterKeyHandlers: Function[];

  init() {
    this.configure(DEFAULT_CONFIG);

    this.enterKeyHandlers = [];

    this.on('mount', () => {
      this.searchBox = this.findSearchBox();
      this.searchBox.addEventListener('keydown', this.keydownListener);
      if (this._config.sayt) this.tags['gb-sayt'].listenForInput(this);
    });

    if (this._config.autoSearch) {
      this.on('mount', this.listenForInput);
    } else if (this._config.staticSearch) {
      this.on('mount', this.listenForStaticSearch);
    } else {
      this.on('mount', this.listenForSubmit);
    }

    this.flux.on(Events.REWRITE_QUERY, this.rewriteQuery);
  }

  rewriteQuery(query: string) {
    this.searchBox.value = query;
  }

  listenForInput() {
    this.searchBox.addEventListener('input', () => this.flux.reset(this.inputValue()));
  }

  listenForSubmit() {
    this.enterKeyHandlers.push(() => this.flux.reset(this.inputValue()));
  }

  listenForStaticSearch() {
    this.enterKeyHandlers.push(this.setLocation);
  }

  keydownListener(event: KeyboardEvent) {
    let sayt = findTag('gb-sayt');
    if (sayt) {
      let autocomplete = (<Sayt>sayt['_tag']).autocomplete;
      autocomplete.keyboardListener(event, this.onSubmit);
    } else if (event.keyCode === KEY_ENTER) {
      this.onSubmit();
    }
  }

  onSubmit() {
    this.enterKeyHandlers.forEach((f) => f());
    this.flux.emit('autocomplete:hide');
  }

  private findSearchBox() {
    if (this.tags['gb-search-box']) {
      return this.tags['gb-search-box'].searchBox;
    } else {
      return this.root.querySelector('input');
    }
  }

  private inputValue() {
    return this.searchBox.value;
  }

  private setLocation() {
    // TODO better way to do this is with browser history rewrites
    if (this.services.url.active()) {
      this.services.url.update(this.inputValue());
    } else {
      this.flux.reset(this.inputValue());
    }
  }
}
