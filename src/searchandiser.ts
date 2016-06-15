import { Query, BrowserBridge, Results, FluxCapacitor, Events } from 'groupby-api';
import riot = require('riot');

export class Searchandiser {

  static config: ISearchandiserConfig & any = {};
  static flux: FluxCapacitor & any;

  constructor(config: ISearchandiserConfig & any = {}) {
    Searchandiser.config = config;
    Searchandiser.flux = new FluxCapacitor(config.customerId, {
      collection: Searchandiser.config.collection,
      area: Searchandiser.config.area,
      language: Searchandiser.config.language
    });
    Object.assign(Searchandiser.flux, Events, { OVERRIDE_QUERY: 'override_query' });
  }

  static attach(tagName: Component, cssSelector: string, options: any = {}, handler?: (tag) => void) {
    riot.mount(cssSelector, `gb-${tagName}`, Object.assign({ stylish: Searchandiser.config.stylish }, options, {
      config: Searchandiser.config,
      flux: Searchandiser.flux
    }));
  }

  static search(query?: string) {
    return this.flux.search(query);
  }
}

// let CONFIG: ISearchandiserConfig & any = {};
//
// export function Searchandiser2() {
//   function configure(config: ISearchandiserConfig & any = CONFIG) {
//     Object.assign(this, new Searchandiser());
//   }
// }

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
