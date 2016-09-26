import { initServices } from './services/init';
import { CollectionsConfig } from './tags/collections/gb-collections';
import { FilterConfig } from './tags/filter/gb-filter';
import { MixinFlux } from './tags/tag';
import { checkNested } from './utils/common';
import { ProductStructure } from './utils/product-transformer';
import { BeautifierConfig } from './utils/url-beautifier';
import { Events, FluxCapacitor, FluxConfiguration, Sort } from 'groupby-api';
import * as riot from 'riot';

export const CONFIGURATION_MASK = '{collection,area,language,pageSize,sort,fields}';
export const DEFAULT_CONFIG = { initialSearch: true };
export const DEFAULT_URL_CONFIG = { queryParam: 'q', searchUrl: 'search' };

export function initSearchandiser() {
  return function configure(rawConfig: SearchandiserConfig & any = {}) {
    const config: SearchandiserConfig = applyDefaultConfig(rawConfig);
    const flux = Object.assign(initCapacitor(config), Events);
    const services = initServices(flux, config);
    riot.mixin(MixinFlux(flux, config, services));
    Object.assign(configure, { flux, services, config }, new Searchandiser()['__proto__']);
  };
}

export function initCapacitor(config: SearchandiserConfig) {
  const finalConfig = transformConfig(config);
  return new FluxCapacitor(finalConfig.customerId, finalConfig, CONFIGURATION_MASK);
}

export function applyDefaultConfig(rawConfig: SearchandiserConfig): SearchandiserConfig {
  const config = Object.assign({}, DEFAULT_CONFIG, rawConfig);
  config.url = Object.assign(DEFAULT_URL_CONFIG, config.url);
  return config;
}

export function transformConfig(config: SearchandiserConfig): SearchandiserConfig & any {
  let finalConfig: FluxConfiguration & { sort: any[] } = <any>config;
  if (config.pageSizes) finalConfig.pageSize = config.pageSizes[0];
  if (config.bridge) {
    const bridgeConfig: BridgeConfig = {};

    const headers = config.bridge.headers || {};
    if (config.bridge.skipCache) headers['Skip-Caching'] = true;
    if (config.bridge.skipSemantish) headers['Skip-Semantish'] = true;
    bridgeConfig.headers = headers;

    if (config.bridge.https) bridgeConfig.https = true;

    Object.assign(finalConfig.bridge, bridgeConfig);
  }
  if (checkNested(config, 'tags', 'sort', 'options')) {
    finalConfig.sort = [config.tags.sort.options.map((val) => val.value)[0]];
  }
  return finalConfig;
}

export class Searchandiser {

  flux: FluxCapacitor;
  services: any;
  config: SearchandiserConfig;

  init() {
    if (this.config.initialSearch) this.search();
  }

  attach(tagName: string, opts?: any);
  attach(tagName: string, cssSelector: string, opts?: any);
  attach(tagName: string, selectorOrOpts?: any, options?: any) {
    let tag;
    if (typeof selectorOrOpts === 'string') {
      tag = this.cssAttach(tagName, selectorOrOpts, options);
    } else {
      tag = this.simpleAttach(tagName, selectorOrOpts);
    }
    if (tag) {
      return tag.length === 1 ? tag[0] : tag;
    } else {
      return null;
    }
  }

  compile() {
    riot.compile(() => null);
  }

  search(query?: string) {
    return this.flux.search(query)
      .then(() => this.flux.emit(Events.PAGE_CHANGED, { pageNumber: 1, finalPage: this.flux.page.finalPage }));
  }

  private simpleAttach(tagName: string, options: any = {}) {
    return riot.mount(this.riotTagName(tagName), options);
  }

  private cssAttach(tagName: string, cssSelector: string = `.${tagName}`, options: any = {}) {
    return riot.mount(cssSelector, this.riotTagName(tagName), options);
  }

  private riotTagName(tagName: string) {
    return tagName.startsWith('gb-') ? tagName : `gb-${tagName}`;
  }
}

export interface BridgeConfig {
  https?: boolean;
  headers?: any;
  skipCache?: boolean;
  skipSemantish?: boolean;
}

export interface UrlConfig {
  beautifier?: boolean | BeautifierConfig;
  queryParam?: string;
  searchUrl?: string;
  detailsUrl?: string;
}

export interface TrackerConfig {
  sessionId?: string;
  visitorId?: string;
}

export interface SearchandiserConfig {
  bridge?: BridgeConfig;

  url?: UrlConfig;

  tracker?: TrackerConfig;

  customerId: string;
  area?: string;
  collection?: string;
  language?: string;
  pageSize?: number;
  pageSizes?: number[];
  sort?: Sort[];
  tags: {
    sort?: {
      options?: any[];
    };
    sayt?: {
      structure?: ProductStructure;
      products?: number;
      queries?: number;
      autoSearch?: boolean;
      staticSearch?: boolean;
      highlight?: boolean;
      categoryField?: string;
      navigationNames?: any;
      allowedNavigations?: string[];
      minimumCharacters?: number;
      delay?: number;
      https?: boolean;
    };
    collections?: CollectionsConfig;
    filter?: FilterConfig;
  };
  stylish?: boolean;
  initialSearch?: boolean;
  structure?: ProductStructure;
}
