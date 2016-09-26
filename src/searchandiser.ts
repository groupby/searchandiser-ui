import { initServices } from './services/init';
import { MixinFlux } from './tags/tag';
import { BeautifierConfig } from './url-beautifier';
import { checkNested } from './utils';
import { Events, FluxCapacitor, Sort } from 'groupby-api';
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
    Object.assign(configure, { flux, config }, new Searchandiser()['__proto__']);
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
  let finalConfig: SearchandiserConfig & { headers: any, https: boolean } = <any>config;
  if (config.pageSizes) finalConfig.pageSize = config.pageSizes[0];
  if (config.bridge) {
    let headers = config.bridge.headers || {};
    if (config.bridge.skipCache) headers['Skip-Caching'] = true;
    if (config.bridge.skipSemantish) headers['Skip-Semantish'] = true;
    finalConfig.headers = headers;
    if (config.bridge.https) finalConfig.https = true;
    delete finalConfig.bridge;
  }
  if (checkNested(config, 'tags', 'sort', 'options')) {
    finalConfig.sort = [config.tags.sort.options.map((val) => val.value)[0]];
  }
  return finalConfig;
}

export class Searchandiser {

  flux: FluxCapacitor;
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

export interface ProductStructure {
  title?: string;
  image?: string;
  description?: string;
  url?: string;
  variants?: string;
  _transform?: (original: any) => any;
  _variantStructure?: ProductStructure;
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
}

export interface SearchandiserConfig {
  bridge?: BridgeConfig;

  url?: UrlConfig;

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
    collections?: {
      options?: string[];
    };
  };
  stylish?: boolean;
  initialSearch?: boolean;
  structure?: ProductStructure;
}
