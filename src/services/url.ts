import { SearchandiserConfig } from '../searchandiser';
import { LOCATION } from '../utils/common';
import { SimpleBeautifier } from '../utils/simple-beautifier';
import { BeautifierConfig, UrlBeautifier } from '../utils/url-beautifier';
import { Services } from './init';
import { FluxCapacitor, Query } from 'groupby-api';
import * as parseUri from 'parseUri';

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
    this.beautifier = new UrlBeautifier(this.config);
    this.simple = new SimpleBeautifier(this.config);

    if (!this.config.initialSearch) {

      let query;
      if (this.beautify) {
        query = Url.parseBeautifiedUrl(this.beautifier);
      } else {
        query = Url.parseUrl(this.simple);
      }

      if (query) {
        this.flux.query = query;
        this.flux.search(query.raw.query)
          .then(() => this.services.tracker.search());
      }
    }
  }

  active() {
    return LOCATION.pathname() !== this.urlConfig.searchUrl;
  }

  // TODO: better way to do this is with browser history rewrites
  update(query: string, refinements: any[] = this.flux.query.raw.refinements) {
    const queryObj = new Query(query).withSelectedRefinements(...refinements);

    let url;
    if (this.beautify) {
      url = this.beautifier.build(queryObj);
    } else {
      url = this.simple.build(queryObj);
    }

    Url.setLocation(url, this.urlConfig);
  }

  static parseUrl(simple: SimpleBeautifier) {
    return simple.parse(LOCATION.href());
  }

  static parseBeautifiedUrl(beautifier: UrlBeautifier) {
    return beautifier.parse(LOCATION.href());
  }

  static setLocation(url: string, config: UrlConfig) {
    if (LOCATION.pathname() === config.searchUrl) {
      LOCATION.setSearch(`?${parseUri(url).query}`);
    } else {
      LOCATION.replace(url);
    }
  }
}
