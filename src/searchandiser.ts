import { Query, BrowserBridge, Results, FluxCapacitor, Events } from 'groupby-api';
import { pluck } from './utils';
import riot = require('riot');

export function initSearchandiser() {
  return function configure(config: SearchandiserConfig & any = {}) {
    const flux = initCapacitor(config);
    Object.assign(flux, Events);
    Object.assign(configure, new Searchandiser(flux, config));
  }
}

function initCapacitor(config: SearchandiserConfig) {
  return new FluxCapacitor(config.customerId, pluck(config, 'collection', 'area', 'language', 'pageSize'));
}

class Searchandiser {

  constructor(public flux: FluxCapacitor, public config: SearchandiserConfig) { }

  attach = (tagName: Component, cssSelector: string = `.${tagName}`, options: any = {}, handler?: (tag) => void) => {
    const tag = riot.mount(cssSelector, `gb-${tagName}`, Object.assign(options, this));
    if (handler && tag.length) handler(tag[0]);
  };

  template = (templateName: string, cssSelector: string, options: any = {}) => {
    this.attach('template', cssSelector, Object.assign(options, { templateName }));
  };

  search = (query?: string) => this.flux.search(query);

  style = () => this.config.stylish ? 'gb-stylish' : '';

  clone = () => initCapacitor(this.config);
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
  stylish?: boolean;

  structure?: {
    title?: string;
    imagePrefix?: string;
    image?: string;
    imageSuffix?: string;
    description?: string;
  };
}
