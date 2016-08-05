import { Query, BrowserBridge, Results, FluxCapacitor, Events, Sort } from 'groupby-api';
import { RootTag } from './tags/tag';
import { pluck, checkNested } from './utils';
import riot = require('riot');

export function initSearchandiser() {
  return function configure(config: SearchandiserConfig & any = {}) {
    const finalConfig = Object.assign({ initialSearch: true }, config);
    const flux = initCapacitor(finalConfig);
    Object.assign(flux, Events);
    riot.mixin(RootTag(flux, finalConfig));
    Object.assign(configure, new Searchandiser(flux, finalConfig));
  }
}

export function initCapacitor(config: SearchandiserConfig) {
  if (config.pageSizes) config.pageSize = config.pageSizes[0];
  if (checkNested(config, 'tags', 'sort', 'options')) config.sort = config.tags.sort.options.map(val => val.value);
  return new FluxCapacitor(config.customerId, pluck(config, 'collection', 'area', 'language', 'pageSize', 'sort', 'fields'));
}

export class Searchandiser {

  queryConfig: any;

  constructor(public flux: FluxCapacitor, public config: SearchandiserConfig) {
    this.queryConfig = pluck(config, 'collection', 'area', 'language', 'pageSize', 'sort', 'fields');
    if (config.initialSearch) this.search();
  }

  attach = (tagName: Component, cssSelector: string = `.${tagName}`, options: any = {}, handler?: (tag) => void) => {
    const tag = riot.mount(cssSelector, `gb-${tagName}`, options);
    if (handler && tag.length) handler(tag[0]);
  };

  template = (templateName: string, cssSelector: string, options: any = {}) => {
    this.attach('template', cssSelector, Object.assign(options, { templateName }));
  };

  search = (query?: string) => this.flux.search(query)
    .then(res => this.flux.emit(Events.PAGE_CHANGED, { pageIndex: 0, finalPage: this.flux.page.finalPage }));
}

export type Component = 'query' |
  'didYouMean' |
  'relatedSearches' |
  'selectedNavigation' |
  'availableNavigation' |
  'paging' |
  'results' |
  'template';

export interface SearchandiserConfig {
  customerId: string,
  area?: string;
  collection?: string;
  language?: string;
  pageSize?: number;
  pageSizes?: number[];
  sort?: Sort[];
  tags: {
    sort?: {
      options?: any[]
    };
  };
  stylish?: boolean;
  initialSearch?: boolean;

  structure?: {
    title?: string;
    imagePrefix?: string;
    image?: string;
    imageSuffix?: string;
    description?: string;
  };
}
