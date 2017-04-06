import { SearchandiserConfig } from '../searchandiser';
import { LOCATION } from '../utils/common';
import { SimpleBeautifier } from '../utils/simple-beautifier';
import { BeautifierConfig, UrlBeautifier } from '../utils/url-beautifier';
import { Services } from './init';
import { REFINE_EVENT } from './search';
import { FluxCapacitor, Query } from 'groupby-api';
import * as parseUri from 'parseUri';

export const LOCATION_EVENT = 'location:set';

export interface UrlConfig {
  beautifier?: boolean | BeautifierConfig;
  queryParam?: string;
  searchUrl?: string;
  detailsUrl?: string;
  staticSearch?: boolean;
}

export class Url {

  urlConfig: UrlConfig;
  beautifier: UrlBeautifier;
  simple: SimpleBeautifier;
  beautify: boolean;
  initialComplete: boolean;

  constructor(private flux: FluxCapacitor, private config: SearchandiserConfig, private services: Services) {
    this.urlConfig = this.config.url || {};
    this.beautify = !!this.urlConfig.beautifier;
    this.initialComplete = !!this.config.initialSearch;
  }

  init() {
    this.beautifier = new UrlBeautifier(this.config, this.services.search._config);
    this.simple = new SimpleBeautifier(this.config, this.services.search._config);

    window.addEventListener('popstate', () => this.readStateFromUrl(true));

    if (!this.config.initialSearch) {
      this.initialComplete = true;
      this.readStateFromUrl();
    }
  }

  readStateFromUrl(skipUrlUpdate: boolean = false) {
    const query = this.beautify
      ? Url.parseBeautifiedUrl(this.beautifier)
      : Url.parseUrl(this.simple);

    if (query && (query.raw.query || query.raw.refinements.length)) {
      this.flux.emit(REFINE_EVENT, {
        query: query.raw.query || '',
        refinements: query.raw.refinements,
        _skip: true
      });
    }
  }

  isActive() {
    return LOCATION.pathname() !== this.urlConfig.searchUrl;
  }

  update(query: Query) {
    const url = (this.beautify ? this.beautifier : this.simple).build(query);

    Url.setLocation(url, this.urlConfig, this.flux.query.raw.query);
  }

  static parseUrl(simple: SimpleBeautifier) {
    return simple.parse(LOCATION.href());
  }

  static parseBeautifiedUrl(beautifier: UrlBeautifier) {
    return beautifier.parse(LOCATION.href());
  }

  static setLocation(url: string, config: UrlConfig, query: string) {
    if (config.staticSearch) {
      LOCATION.replace(url);
    } else {
      document.getElementsByTagName('title')[0].innerHTML = `search ${query}`;
      history.pushState({}, 'Search', `?${parseUri(url).query}`);
    }
  }
}
