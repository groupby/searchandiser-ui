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
    const queryObj = typeof query === 'string' ? new Query(query) : query;
    queryObj.withConfiguration({
      collection: Searchandiser.CONFIG.collection,
      area: Searchandiser.CONFIG.area,
      language: Searchandiser.CONFIG.language
    });
    this.bridge.search(queryObj, (err, res) => {
      Searchandiser.query = queryObj;
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
