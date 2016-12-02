import { initServices, Service } from './services/init';
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
import { Configuration } from './utils/configuration';
import { ProductStructure } from './utils/product-transformer';
import { Events, FluxBridgeConfig, FluxCapacitor, Sort } from 'groupby-api';
import * as riot from 'riot';

export const CONFIGURATION_MASK = '{collection,area,language,pageSize,sort,fields,customUrlParams,pruneRefinements,disableAutocorrection,visitorId,sessionId}'; // tslint:disable:max-line-length

export function initSearchandiser() {
  return function configure(rawConfig: SearchandiserConfig = <any>{}) {
    const config = new Configuration(rawConfig).apply();
    const flux = new FluxCapacitor(config.customerId, config, CONFIGURATION_MASK);
    Object.assign(flux, Events);
    const services = initServices(flux, config);
    riot.mixin(MixinFlux(flux, config, services));
    Object.assign(configure, { flux, services, config }, new Searchandiser()['__proto__']);
  };
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
    return tagName.startsWith('gb-') || !this.config.simpleAttach ? tagName : `gb-${tagName}`;
  }
}

export interface BridgeConfig extends FluxBridgeConfig {
  skipCache?: boolean;
  skipSemantish?: boolean;
}

export interface SearchandiserConfig {
  customerId: string;
  structure: ProductStructure;

  // services
  bridge?: BridgeConfig;
  url?: UrlConfig;
  tracker?: TrackerConfig;

  area?: string;
  collection?: string;
  customUrlParams?: any[];
  disableAutocorrection?: boolean;
  language?: string;
  pageSize?: number;
  pageSizes?: number[];
  sort?: Sort[];
  visitorId?: string;
  sessionId?: string;

  tags?: {
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
  services?: { [name: string]: Service | boolean };
  stylish?: boolean;
  initialSearch?: boolean;
  simpleAttach?: boolean;
}
