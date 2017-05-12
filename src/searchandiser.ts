import { Events, FluxBridgeConfig, FluxCapacitor, Sort } from 'groupby-api';
import { initServices, Service } from './services/init';
import { TrackerConfig } from './services/tracker';
import { UrlConfig } from './services/url';
import { BreadcrumbsOpts } from './tags/breadcrumbs/gb-breadcrumbs';
import { CollectionsOpts } from './tags/collections/gb-collections';
import { DetailsOpts } from './tags/details/gb-details';
import { FilterOpts } from './tags/filter/gb-filter';
import { NavigationOpts } from './tags/navigation/gb-navigation';
import { PageSizeOpts } from './tags/page-size/gb-page-size';
import { PagingOpts } from './tags/paging/gb-paging';
import { QueryOpts } from './tags/query/gb-query';
import { SaytOpts } from './tags/sayt/gb-sayt';
import { SortOpts } from './tags/sort/gb-sort';
import { SubmitOpts } from './tags/submit/gb-submit';
import { riot } from './utils/common';
import { Configuration } from './utils/configuration';
import { ProductStructure } from './utils/product-transformer';
import { MixinFlux } from './utils/tag';

export function initSearchandiser() {
  return function configure(rawConfig: SearchandiserConfig = <any>{}) {
    const config = new Configuration(rawConfig).apply();
    const flux = new FluxCapacitor(config.customerId);
    Object.assign(flux, Events);
    const services = initServices(flux, config);

    flux.query.withConfiguration(services.search._config);
    riot.mixin(MixinFlux(flux, config, services));
    Object.assign(configure, { flux, services, config }, new Searchandiser()['__proto__']);
    (<any>configure).init();

    // tslint:disable-next-line:no-console
    // console.log(`StoreFront v${configure['version']} Loaded 🏬`);
  };
}

export class Searchandiser {

  flux: FluxCapacitor;
  services: any;
  config: SearchandiserConfig;

  init() {
    if (this.config.initialSearch) {
      this.search();
    }
  }

  attach(tagName: string, opts?: any);
  attach(tagName: string, cssSelector: string, opts?: any);
  attach(tagName: string, selectorOrOpts?: any, options?: any) {
    const tag = typeof selectorOrOpts === 'string'
      ? this.cssAttach(tagName, selectorOrOpts, options)
      : this.simpleAttach(tagName, selectorOrOpts);

    if (tag) {
      return tag.length === 1 ? tag[0] : tag;
    } else {
      return null;
    }
  }

  compile(onCompile: () => void) {
    riot.compile(onCompile);
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
  fields?: string | string[];
  customUrlParams?: any[];
  disableAutocorrection?: boolean;
  pruneRefinements?: boolean;
  language?: string;
  pageSize?: number;
  pageSizes?: number[];
  sort?: Sort[];
  visitorId?: string;
  sessionId?: string;

  tags?: {
    breadcrumbs?: BreadcrumbsOpts;
    collections?: CollectionsOpts;
    details?: DetailsOpts;
    filter?: FilterOpts;
    navigation?: NavigationOpts;
    pageSize?: PageSizeOpts;
    paging?: PagingOpts;
    query?: QueryOpts;
    sayt?: SaytOpts;
    sort?: SortOpts;
    submit?: SubmitOpts;
  };
  services?: { [name: string]: Service | boolean };
  stylish?: boolean;
  initialSearch?: boolean;
  simpleAttach?: boolean;
}
