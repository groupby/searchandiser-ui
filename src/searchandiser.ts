import { Query, BrowserBridge, Results, FluxCapacitor, Events } from 'groupby-api';
import riot = require('riot');

export class Searchandiser {

  private static CONFIG: ISearchandiserConfig & any = {};
  static flux: FluxCapacitor & any;
  static bridge: BrowserBridge;
  static query: Query;
  static results: Results;
  static state: ISearchState & any = {
    lastStep: 0,
    refinements: []
  };
  static el: any = {};

  constructor(config: ISearchandiserConfig & any = {}) {
    Searchandiser.CONFIG = config;
    Searchandiser.bridge = new BrowserBridge(config.customerId);
    Searchandiser.flux = new FluxCapacitor(config.customerId, {
      collection: Searchandiser.CONFIG.collection,
      area: Searchandiser.CONFIG.area,
      language: Searchandiser.CONFIG.language
    });
    Object.assign(Searchandiser.flux, Events, { OVERRIDE_QUERY: 'override_query' });
    riot.observable(Searchandiser.el);
  }

  static attach(tagName: Component, cssSelector: string, options: any = {}, handler?: (tag) => void) {
    riot.mount(cssSelector, `gb-${tagName}`, Object.assign({ stylish: Searchandiser.CONFIG.stylish }, options, { srch: Searchandiser, flux: Searchandiser.flux }));
  }

  static search(query?: string) {
    return this.flux.search(query);
  }
}

export interface ISearchState {
  lastStep: number;
  refinements: any[];
}

export type Component = 'query' |
  'didYouMean' |
  'relatedSearches' |
  'selectedNavigation' |
  'availableNavigation' |
  'paging' |
  'results' |
  'template';

export interface ISearchandiserConfig {
  customerId: string,
  area?: string;
  collection?: string;
  language?: string;
  stylish?: boolean;

  structure?: {
    title?: string;
    imagePrefix?: string;
    image?: string;
    imageSuffix?: string;
    description?: string;
  };
}
