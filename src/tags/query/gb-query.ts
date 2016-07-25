import { Events } from 'groupby-api';
import { unless, getParam } from '../../utils';
import { mount } from '../sayt/query-wrapper';

const ENTER_KEY = 13;

export class Query {

  opts: any;
  root: HTMLInputElement;
  on: (string, Function) => void;

  queryParam: string;
  searchUrl: string;
  staticSearch: string;

  init() {
    const saytEnabled = unless(this.opts.sayt, true);
    const autoSearch = unless(this.opts.autoSearch, true);
    const inputValue = () => this.root.value;

    this.queryParam = this.opts.queryParam || 'q';
    this.searchUrl = `${this.opts.searchUrl || 'search'}?${this.queryParam}=`;
    this.staticSearch = unless(this.opts.staticSearch, false);

    const queryFromUrl = getParam(this.queryParam);

    if (saytEnabled) mount(<Riot.Tag.Instance & any>this);
    if (autoSearch) {
      this.on('before-mount', () => this.listenForInput(inputValue));
    } else if (this.staticSearch) {
      this.on('before-mount', () => this.listenForStaticSubmit(inputValue));
    } else {
      this.on('before-mount', () => this.listenForSubmit(inputValue));
    }

    this.opts.flux.on(Events.REWRITE_QUERY, (query: string) => this.root.value = query);
    if (queryFromUrl) this.opts.flux.rewrite(queryFromUrl);
  }

  listenForInput(value: () => string) {
    this.root.addEventListener('input', () => this.opts.flux.reset(value()));
  }

  listenForStaticSubmit(value: () => string) {
    this.listenForEnter(() => window.location.replace(`${this.searchUrl}${value()}`));
  }

  listenForSubmit(value: () => string) {
    this.listenForEnter(() => this.opts.flux.reset(value()));
  }

  listenForEnter(cb: () => void) {
    this.root.addEventListener('keydown', (event: KeyboardEvent) => {
      switch (event.keyCode) {
        case ENTER_KEY: return cb();
      }
    });
  }
}
