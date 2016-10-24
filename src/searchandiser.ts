import { initServices } from './services/init';
import { TrackerConfig } from './services/tracker';
import { UrlConfig } from './services/url';
import { BreadcrumbsConfig } from './tags/breadcrumbs/gb-breadcrumbs';
import { CollectionsConfig } from './tags/collections/gb-collections';
import { DetailsConfig } from './tags/details/gb-details';
import { FilterConfig } from './tags/filter/gb-filter';
import { NavigationConfig } from './tags/navigation/gb-navigation';
import { PageSizeConfig } from './tags/page-size/gb-page-size';
import { PagingConfig } from './tags/paging/gb-paging';
import { QueryConfig } from './tags/query/gb-query';
import { SaytConfig } from './tags/sayt/gb-sayt';
import { SortConfig } from './tags/sort/gb-sort';
import { SubmitConfig } from './tags/submit/gb-submit';
import { MixinFlux } from './tags/tag';
import { checkNested } from './utils/common';
import { ProductStructure } from './utils/product-transformer';
import { Events, FluxCapacitor, FluxConfiguration, Sort } from 'groupby-api';
import * as riot from 'riot';

export const CONFIGURATION_MASK = '{collection,area,language,pageSize,sort,fields,customUrlParams,pruneRefinements,disableAutocorrection}'; // tslint:disable:max-line-length
export const DEFAULT_CONFIG = { initialSearch: true };
export const DEFAULT_URL_CONFIG = { queryParam: 'q', searchUrl: 'search' };

export function initSearchandiser() {
  return function configure(rawConfig: SearchandiserConfig & any = {}) {
    const config: SearchandiserConfig = applyDefaultConfig(rawConfig);
    validateConfig(config);
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

export function validateConfig(config: SearchandiserConfig) {
  if (!config.structure) {
    throw new Error('must provide a record structure');
  }
  const struct = Object.assign(config.structure, config.structure._variantStructure);
  if (!(struct.title && struct.title.trim())) {
    throw new Error('structure.title must be the path to the title field');
  }
  if (!(struct.price && struct.price.trim())) {
    throw new Error('structure.price must be the path to the price field');
  }
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

export interface SearchandiserConfig {
  bridge?: BridgeConfig;
  url?: UrlConfig;
  tracker?: TrackerConfig;

  customerId: string;
  area?: string;
  collection?: string;
  customUrlParams?: any[];
  disableAutocorrection?: boolean;
  language?: string;
  pageSize?: number;
  pageSizes?: number[];
  sort?: Sort[];
  tags: {
    breadcrumbs?: BreadcrumbsConfig;
    collections?: CollectionsConfig;
    details?: DetailsConfig;
    filter?: FilterConfig;
    navigation?: NavigationConfig;
    pageSize?: PageSizeConfig;
    paging?: PagingConfig;
    query?: QueryConfig;
    sayt?: SaytConfig;
    sort?: SortConfig;
    submit?: SubmitConfig;
  };
  stylish?: boolean;
  initialSearch?: boolean;
  structure: ProductStructure;
}
