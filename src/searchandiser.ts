import { Query, BrowserBridge, Results, FluxCapacitor, Events } from 'groupby-api';
import { pluck } from './utils';
import riot = require('riot');

export function initSearchandiser() {
  return function configure(config: SearchandiserConfig & any = {}) {
    const finalConfig = Object.assign({ initialSearch: true }, config);
    const flux = initCapacitor(finalConfig);
    Object.assign(flux, Events);
    Object.assign(configure, new Searchandiser(flux, finalConfig));
  }
}

function initCapacitor(config: SearchandiserConfig) {
  if (config.pageSizes) config.pageSize = config.pageSizes[0];
  return new FluxCapacitor(config.customerId, pluck(config, 'collection', 'area', 'language', 'pageSize'));
}

class Searchandiser {

  constructor(public flux: FluxCapacitor, public config: SearchandiserConfig) {
    if (config.initialSearch) flux.search('');
  }

  attach = (tagName: Component, cssSelector: string = `.${tagName}`, options: any = {}, handler?: (tag) => void) => {
    const tag = riot.mount(cssSelector, `gb-${tagName}`, Object.assign(options, this));
    if (handler && tag.length) handler(tag[0]);
  };

  template = (templateName: string, cssSelector: string, options: any = {}) => {
    this.attach('template', cssSelector, Object.assign(options, { templateName }));
  };

  search = (query?: string) => this.flux.search(query);

  style = () => this.config.stylish ? 'gb-stylish' : '';

  clone = () => initCapacitor(Object.assign({}, this.config, { initialSearch: false }));
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
