import { findTag, unless } from '../../utils/common';
import { Sayt } from '../sayt/gb-sayt';
import '../sayt/gb-sayt.tag.html';
import { FluxTag } from '../tag';
import { Events } from 'groupby-api';
import * as riot from 'riot';

const KEY_ENTER = 13;

export interface Query extends FluxTag {
  root: riot.TagElement & HTMLInputElement;
}

export class Query {

  parentOpts: any;
  staticSearch: string;
  saytEnabled: boolean;
  autoSearch: boolean;
  searchBox: HTMLInputElement;
  enterKeyHandlers: Function[];

  init() {
    this.parentOpts = this.opts.passthrough || this.opts;
    this.saytEnabled = unless(this.parentOpts.sayt, true);
    this.autoSearch = unless(this.parentOpts.autoSearch, true);
    this.staticSearch = unless(this.parentOpts.staticSearch, false);

    this.enterKeyHandlers = [];

    this.on('mount', () => {
      this.searchBox = this.findSearchBox();
      this.searchBox.addEventListener('keydown', this.keydownListener);
      if (this.saytEnabled) this.tags['gb-sayt'].listenForInput(this);
    });

    if (this.autoSearch) {
      this.on('mount', this.listenForInput);
    } else if (this.staticSearch) {
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
