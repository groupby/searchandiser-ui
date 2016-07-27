import {Events, Query as ApiQuery} from 'groupby-api';
import {unless, getParam, pluck, updateLocation, parseQueryFromLocation} from '../../utils';
import {mount} from '../sayt/query-wrapper';
import queryString = require('query-string');

const ENTER_KEY = 13;

export class Query {

  opts:any;
  root:HTMLInputElement;
  on:(string, Function) => void;

  queryParam:string;
  searchUrl:string;
  staticSearch:string;

  init() {
    const saytEnabled = unless(this.opts.sayt, true);
    const autoSearch = unless(this.opts.autoSearch, true);
    this.queryParam = this.opts.queryParam || 'q';
    this.searchUrl = this.opts.searchUrl || 'search';
    this.staticSearch = unless(this.opts.staticSearch, false);

    const inputValue = () => this.root.value;

    const queryFromUrl = parseQueryFromLocation(this.queryParam, this.opts.queryConfig);

    const setLocation = () => {
      // Better way to do this is with browser history rewrites
      if (window.location.pathname !== this.searchUrl) {
        updateLocation(this.searchUrl, this.queryParam, this.root.value, this.opts.flux.query.request.refinements);
      } else {
        this.opts.flux.reset(this.root.value);
      }
    };

    if (saytEnabled) mount(<Riot.Tag.Instance & any>this);
    if (autoSearch) {
      this.on('before-mount', () => this.listenForInput(inputValue));
    } else if (this.staticSearch) {
      this.on('before-mount', () => this.listenForEnter(setLocation));
    } else {
      this.on('before-mount', () => this.listenForSubmit(inputValue));
    }

    this.opts.flux.on(Events.REWRITE_QUERY, (query:string) => this.root.value = query);
    if (queryFromUrl) {
      this.opts.flux.query = queryFromUrl;
      this.opts.flux.search(queryFromUrl.request.query);
    }
  }

  listenForInput(value:() => string) {
    this.root.addEventListener('input', () => this.opts.flux.reset(value()));
  }

  listenForSubmit(value:() => string) {
    this.listenForEnter(() => this.opts.flux.reset(value()));
  }

  listenForEnter(cb:() => void) {
    this.root.addEventListener('keydown', (event:KeyboardEvent) => {
      switch (event.keyCode) {
        case ENTER_KEY:
          return cb();
      }
    });
  }
}
