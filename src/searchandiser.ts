import { Query, BrowserBridge, Results, FluxCapacitor, Events, Sort } from 'groupby-api';
const TrackerClient = require('gb-tracker-client');
import { pluck, checkNested } from './utils';
import riot = require('riot');

export function initSearchandiser() {
  return function configure(config: SearchandiserConfig & any = {}) {
    const finalConfig = Object.assign({ initialSearch: true }, config);
    const flux = initCapacitor(finalConfig);
    const tracker = initTracker(finalConfig);
    Object.assign(flux, Events);
    Object.assign(configure, new Searchandiser(flux, tracker, finalConfig));
  }
}

function initCapacitor(config: SearchandiserConfig) {
  if (config.pageSizes) config.pageSize = config.pageSizes[0];
  if (checkNested(config, 'tags', 'sort', 'options')) config.sort = config.tags.sort.options.map(val => val.value);
  return new FluxCapacitor(config.customerId, pluck(config, 'collection', 'area', 'language', 'pageSize', 'sort', 'fields'));
}

function initTracker(config: SearchandiserConfig) {
  return new TrackerClient(config.customerId, config.area);
}

export class Searchandiser {

  constructor(public flux: FluxCapacitor, public tracker: TrackerClient, public config: SearchandiserConfig) {
    if (config.initialSearch) this.search();
  }

  attach = (tagName: Component, cssSelector: string = `.${tagName}`, options: any = {}, handler?: (tag) => void) => {
    const tag = riot.mount(cssSelector, `gb-${tagName}`, Object.assign(options, this));
    if (handler && tag.length) handler(tag[0]);
  };

  template = (templateName: string, cssSelector: string, options: any = {}) => {
    this.attach('template', cssSelector, Object.assign(options, { templateName }));
  };

  search = (query?: string) => this.flux.search(query)
    .then(res => this.flux.emit(Events.PAGE_CHANGED, { pageIndex: 0, finalPage: this.flux.page.finalPage }));

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
