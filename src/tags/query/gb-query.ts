import { Events } from 'groupby-api';
import { unless, getParam } from '../../utils';
import { mount } from '../sayt/query-wrapper';

const ENTER_KEY = 13;

export function Query() {
  this.init = function() {
    const saytEnabled = unless(this.opts.sayt, true);
    const autoSearch = unless(this.opts.autoSearch, true);
    const queryFromUrl = getParam(this.queryParam);
    const inputValue = () => this.root.value;

    this.queryParam = this.opts.queryParam || 'q';
    this.searchUrl = `${this.opts.searchUrl || 'search'}?${this.queryParam}=`;
    this.staticSearch = unless(this.opts.staticSearch, false);

    if (saytEnabled) mount(this);
    if (autoSearch) {
      this.on('before-mount', () => this.listenForInput(inputValue));
    } else if (this.staticSearch) {
      this.on('before-mount', () => this.listenForStaticSubmit(inputValue));
    } else {
      this.on('before-mount', () => this.listenForSubmit(inputValue));
    }

    this.opts.flux.on(Events.REWRITE_QUERY, (query: string) => this.root.value = query);
    if (queryFromUrl) this.opts.flux.rewrite(queryFromUrl);
  };

  this.listenForInput = function(value: () => string) {
    this.root.addEventListener('input', () => this.opts.flux.reset(value()));
  };

  this.listenForStaticSubmit = function(value: () => string) {
    this.listenForEnter(() => window.location.replace(`${this.searchUrl}${value()}`));
  };

  this.listenForSubmit = function(value: () => string) {
    this.listenForEnter(() => this.opts.flux.reset(value()));
  };

  this.listenForEnter = function(cb: () => void) {
    this.root.addEventListener('keydown', (event: KeyboardEvent) => {
      switch (event.keyCode) {
        case ENTER_KEY: return cb();
      }
    });
  }
}
