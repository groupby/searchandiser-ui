import { Query, BrowserBridge, Results, FluxCapacitor, Events, Sort } from 'groupby-api';
import { FluxTag, MixinFlux } from './tags/tag';
import { checkNested } from './utils';
import riot = require('riot');

export const CONFIGURATION_MASK = '{collection,area,language,pageSize,sort,fields}';

export function initSearchandiser() {
  return function configure(config: SearchandiserConfig & any = {}) {
    const finalConfig = Object.assign({ initialSearch: true }, config);
    const flux = initCapacitor(finalConfig);
    Object.assign(flux, Events);
    riot.mixin(MixinFlux(flux, finalConfig));
    Object.assign(configure, { flux, config: finalConfig }, new Searchandiser()['__proto__']);
  }
}

export function initCapacitor(config: SearchandiserConfig) {
  const finalConfig = extractConfig(config);
  return new FluxCapacitor(finalConfig.customerId, finalConfig, CONFIGURATION_MASK);
}

export function extractConfig(config: SearchandiserConfig): SearchandiserConfig & any {
  let finalConfig: SearchandiserConfig & { headers: any } = <any>config;
  if (config.pageSizes) finalConfig.pageSize = config.pageSizes[0];
  if (config.bridge) {
    let headers = config.bridge.headers || {};
    if (config.bridge.skipCache) headers['Skip-Caching'] = true;
    if (config.bridge.skipSemantish) headers['Skip-Semantish'] = true;
    finalConfig.headers = headers;
    delete finalConfig.bridge;
  }
  if (checkNested(config, 'tags', 'sort', 'options')) {
    finalConfig.sort = [config.tags.sort.options.map(val => val.value)[0]];
  }
  return finalConfig
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

  private simpleAttach(tagName: string, options: any = {}) {
    return riot.mount(this.riotTagName(tagName), options);
  }

  private cssAttach(tagName: string, cssSelector: string = `.${tagName}`, options: any = {}) {
    return riot.mount(cssSelector, this.riotTagName(tagName), options);
  }

  private riotTagName(tagName: string) {
    return tagName.startsWith('gb-') ? tagName : `gb-${tagName}`;
  }

  search(query?: string) {
    return this.flux.search(query)
      .then(() => this.flux.emit(Events.PAGE_CHANGED, { pageIndex: 0, finalPage: this.flux.page.finalPage }));
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
  headers?: any;
  skipCache?: boolean;
  skipSemantish?: boolean;
}

export interface SearchandiserConfig {
  bridge?: BridgeConfig;

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
      highlight?: boolean;
      categoryField?: string;
      navigationNames?: any;
      allowedNavigations?: string[];
      minimumCharacters?: number;
      delay?: number;
    };
    collections?: {
      options?: string[];
    };
  };
  stylish?: boolean;
  initialSearch?: boolean;
  structure?: ProductStructure;
}
