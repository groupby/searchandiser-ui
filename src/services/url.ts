import { SearchandiserConfig } from '../searchandiser';
import { LOCATION } from '../utils/common';
import { SimpleBeautifier } from '../utils/simple-beautifier';
import { BeautifierConfig, UrlBeautifier } from '../utils/url-beautifier';
import { Services } from './init';
import { FluxCapacitor, Query } from 'groupby-api';
import * as parseUri from 'parseUri';

export const LOCATION_EVENT = 'location:set';

export interface UrlConfig {
  beautifier?: boolean | BeautifierConfig;
  queryParam?: string;
  searchUrl?: string;
  detailsUrl?: string;
}

export class Url {

  urlConfig: UrlConfig;
  beautifier: UrlBeautifier;
  simple: SimpleBeautifier;
  beautify: boolean;

  constructor(private flux: FluxCapacitor, private config: SearchandiserConfig, private services: Services) {
    this.urlConfig = this.config.url || {};
    this.beautify = !!this.urlConfig.beautifier;
  }

  init() {
    this.beautifier = new UrlBeautifier(this.config, this.services.search._config);
    this.simple = new SimpleBeautifier(this.config, this.services.search._config);

    if (!this.config.initialSearch) {

      let query;
      if (this.beautify) {
        query = Url.parseBeautifiedUrl(this.beautifier);
      } else {
        query = Url.parseUrl(this.simple);
      }

      if (query && (query.raw.query || query.raw.refinements.length)) {
        this.flux.query = query;
        this.flux.search(query.raw.query)
          .then(() => this.services.tracker && this.services.tracker.search());
      }
    }
  }

  isActive() {
    return LOCATION.pathname() !== this.urlConfig.searchUrl;
  }

  update(query: Query) {
    const url = (this.beautify ? this.beautifier : this.simple).build(query);

    Url.setLocation(url, this.urlConfig);
  }

  static parseUrl(simple: SimpleBeautifier) {
    return simple.parse(LOCATION.href());
  }

  static parseBeautifiedUrl(beautifier: UrlBeautifier) {
    return beautifier.parse(LOCATION.href());
  }

  // TODO: better way to do this is with browser history rewrites
  static setLocation(url: string, config: UrlConfig) {
    if (LOCATION.pathname() === config.searchUrl) {
      LOCATION.setSearch(`?${parseUri(url).query}`);
    } else {
      LOCATION.replace(url);
    }
  }
}
