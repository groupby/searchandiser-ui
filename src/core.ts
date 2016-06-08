import { Query, BrowserBridge, Results } from 'groupby-api';
import riot = require('riot');

export class Searchandiser {

  private static CONFIG: ISearchandiserConfig & any = {};
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
    riot.observable(Searchandiser.el);
  }

  static attach(tagName: Component, cssSelector: string, options: any = {}, handler?: (tag) => void) {
    riot.mount(cssSelector, `gb-${tagName}`, Object.assign({ stylish: Searchandiser.CONFIG.stylish }, options, { srch: Searchandiser }));
  }

  static search(query: string | Query) {
    this.bridge.search(query, (err, res) => {
      if (typeof query === 'string') {
        Searchandiser.query = new Query(query);
      } else {
        Searchandiser.query = query;
      }
      Searchandiser.results = res;
      Searchandiser.el.trigger('results');
      console.log(res);
    });
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
