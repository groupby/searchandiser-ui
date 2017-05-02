import { FluxCapacitor, Query } from 'groupby-api';
import { StoreFrontConfig } from '../searchandiser';
import { LOCATION, URL } from '../utils/common';
import { SimpleBeautifier } from '../utils/simple-beautifier';
import { BeautifierConfig, UrlBeautifier } from '../utils/url-beautifier';
import { Services } from './init';
import { REFINE_EVENT } from './search';

export const LOCATION_EVENT = 'location:set';

export interface UrlConfig {
  beautifier?: boolean | BeautifierConfig;
  queryParam?: string;
  searchUrl?: string;
  detailsUrl?: string;
  staticSearch?: boolean;
}

export class Url {

  // urlConfig: UrlConfig;
  // beautifier: UrlBeautifier;
  // simple: SimpleBeautifier;
  // beautify: boolean;
  // title: string;
  //
  // constructor(private flux: FluxCapacitor, private config: SearchandiserConfig, private services: Services) {
  //   this.urlConfig = this.config.url || {};
  //   this.beautify = !!this.urlConfig.beautifier;
  // }
  //
  init() {
    //   this.beautifier = new UrlBeautifier(this.config, this.services.search._config);
    //   this.simple = new SimpleBeautifier(this.config, this.services.search._config);
    //   this.title = document.title;
    //
    //   window.addEventListener('popstate', (data) => {
    //     this.readStateFromUrl();
    //   });
    //
    //   if (!this.config.initialSearch) {
    //     this.readStateFromUrl();
    //   }
  }
  //
  // readStateFromUrl() {
  //   const query = this.beautify
  //     ? Url.parseBeautifiedUrl(this.beautifier)
  //     : Url.parseUrl(this.simple);
  //
  //   if (query && (query.raw.query || query.raw.refinements.length)) {
  //     this.flux.emit(REFINE_EVENT, {
  //       query: query.raw.query || '',
  //       refinements: query.raw.refinements
  //     });
  //   }
  // }
  //
  // update(query: Query) {
  //   const currentState = history.state.state ? history.state.state[history.state.state.length - 1] : null;
  //   if (Url.hasStateChanged(currentState.query, query.build())) {
  //     const url = (this.beautify ? this.beautifier : this.simple).build(query);
  //     this.setLocation(url);
  //   }
  // }
  //
  // setLocation(url: string) {
  //   if (this.urlConfig.staticSearch) {
  //     LOCATION.replace(url);
  //   } else {
  //     history.pushState({}, 'Search', `?${new URL(url).query}`);
  //     document.getElementsByTagName('title')[0].innerHTML = `${this.title} - ${this.flux.query.raw.query}`;
  //   }
  // }
  //
  // static hasStateChanged(oldState: any, newState: any) {
  //
  // }
  //
  // static parseUrl(simple: SimpleBeautifier) {
  //   return simple.parse(LOCATION.href());
  // }
  //
  // static parseBeautifiedUrl(beautifier: UrlBeautifier) {
  //   return beautifier.parse(LOCATION.href());
  // }
}
