import '../sayt/gb-sayt.tag';
import { FluxTag } from '../tag';
import { Events, Query as QueryModel } from 'groupby-api';
import { unless, updateLocation, parseQueryFromLocation } from '../../utils';
import { QueryWrapper } from '../sayt/query-wrapper';
import queryString = require('query-string');
import riot = require('riot');

const ENTER_KEY = 13;

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

  init() {
    this.parentOpts = this.opts.passthrough || this.opts;
    this.queryParam = this.parentOpts.queryParam || 'q';
    this.searchUrl = this.parentOpts.searchUrl || 'search';
    this.saytEnabled = unless(this.parentOpts.sayt, true);
    this.autoSearch = unless(this.parentOpts.autoSearch, true);
    this.staticSearch = unless(this.parentOpts.staticSearch, false);

    this.queryFromUrl = parseQueryFromLocation(this.queryParam, this.config);

    if (this.saytEnabled) new QueryWrapper(this).mount();

    if (this.autoSearch) {
      this.on('before-mount', () => this.listenForInput(this.inputValue));
    } else if (this.staticSearch) {
      this.on('before-mount', () => this.listenForEnter(this.setLocation));
    } else {
      this.on('before-mount', () => this.listenForSubmit(this.inputValue));
    }

    this.flux.on(Events.REWRITE_QUERY, this.rewriteQuery);

    if (!this.config.initialSearch && this.queryFromUrl) {
      this.flux.query = this.queryFromUrl;
      this.flux.search(this.queryFromUrl.raw.query);
    }
  }

  rewriteQuery(query: string) {
    this.root.value = query;
  }

  private inputValue() {
    return this.root.value;
  }

  private setLocation() {
    // Better way to do this is with browser history rewrites
    if (window.location.pathname !== this.searchUrl) {
      updateLocation(this.searchUrl, this.queryParam, this.inputValue(), this.flux.query.raw.refinements);
    } else {
      this.flux.reset(this.inputValue());
    }
  }

  listenForInput(value: () => string) {
    this.root.addEventListener('input', () => this.flux.reset(value()));
  }

  listenForSubmit(value: () => string) {
    this.listenForEnter(() => this.flux.reset(value()));
  }

  listenForEnter(cb: () => void) {
    this.root.addEventListener('keydown', (event: KeyboardEvent) => {
      switch (event.keyCode) {
        case ENTER_KEY:
          return cb();
      }
    });
  }
}
