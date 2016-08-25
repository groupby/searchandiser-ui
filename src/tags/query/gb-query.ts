import '../sayt/gb-sayt.tag';
import { FluxTag } from '../tag';
import { Events, Query as QueryModel } from 'groupby-api';
import { unless, updateLocation, parseQueryFromLocation, findTag } from '../../utils';
import { Sayt } from '../sayt/gb-sayt';
import queryString = require('query-string');
import riot = require('riot');

const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_ENTER = 13;

export interface Query extends FluxTag {
  root: HTMLInputElement;
}

export class Query {

  parentOpts: any;
  queryParam: string;
  searchUrl: string;
  staticSearch: string;
  saytEnabled: boolean;
  autoSearch: boolean;
  queryFromUrl: QueryModel;
  searchBox: HTMLInputElement;
  enterKeyHandlers: Function[];

  init() {
    this.parentOpts = this.opts.passthrough || this.opts;
    this.queryParam = this.parentOpts.queryParam || 'q';
    this.searchUrl = this.parentOpts.searchUrl || 'search';
    this.saytEnabled = unless(this.parentOpts.sayt, true);
    this.autoSearch = unless(this.parentOpts.autoSearch, true);
    this.staticSearch = unless(this.parentOpts.staticSearch, false);

    this.queryFromUrl = parseQueryFromLocation(this.queryParam, this.config);

    this.enterKeyHandlers = [];

    this.on('mount', () => {
      this.searchBox = this.findSearchBox();
      this.searchBox.addEventListener('keydown', this.keydownListener);
      if (this.saytEnabled) Sayt.listenForInput(this)
    });

    if (this.autoSearch) {
      this.on('mount', this.listenForInput);
    } else if (this.staticSearch) {
      this.on('mount', this.listenForStaticSearch);
    } else {
      this.on('mount', this.listenForSubmit);
    }

    this.flux.on(Events.REWRITE_QUERY, this.rewriteQuery);

    if (!this.config.initialSearch && this.queryFromUrl) {
      this.flux.query = this.queryFromUrl;
      this.flux.search(this.queryFromUrl.raw.query);
    }
  }

  private findSearchBox() {
    if (this.tags['gb-search-box']) {
      return this.tags['gb-search-box'].searchBox;
    } else {
      return this.root.querySelector('input');
    }
  }

  rewriteQuery(query: string) {
    this.searchBox.value = query;
  }

  private inputValue() {
    return this.searchBox.value;
  }

  private setLocation() {
    // Better way to do this is with browser history rewrites
    if (window.location.pathname !== this.searchUrl) {
      updateLocation(this.searchUrl, this.queryParam, this.inputValue(), this.flux.query.raw.refinements);
    } else {
      this.flux.reset(this.inputValue());
    }
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
    let autocomplete = null;
    if (findTag('gb-sayt')) {
      autocomplete = (<Sayt>((<any>findTag('gb-sayt'))._tag)).autocomplete;
    }


    if (autocomplete && autocomplete.isSelectedInAutocomplete()) {
      switch (event.keyCode) {
        case KEY_UP:
          // Prevent cursor from moving to front of text box
          event.preventDefault();

          if (autocomplete.getOneAbove()) autocomplete.selectOneAbove();
          else {
            this.rewriteQuery(autocomplete.preautocompleteValue);
            autocomplete.reset();
          }
          break;
        case KEY_DOWN:
          autocomplete.selectOneBelow();
          break;
        case KEY_ENTER:
          autocomplete.selected.querySelector('a').click();
          autocomplete.reset();
          break;
      }
    }
    else {
      switch (event.keyCode) {
        case KEY_UP:
          if (autocomplete) {
            this.flux.emit('autocomplete:hide');
          }
          break;
        case KEY_DOWN:
          if (autocomplete) {
            autocomplete.preautocompleteValue = this.searchBox.value;
            autocomplete.selectFirstLink();
            this.flux.emit('autocomplete');
          }
          break;
        case KEY_ENTER:
          this.enterKeyHandlers.forEach((f) => f());
          break;
      }
    }
  }
}
