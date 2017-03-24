import { SearchandiserConfig } from '../searchandiser';
import { Services } from './init';
import { FluxCapacitor, Request } from 'groupby-api';
import oget = require('oget');

export const RESET_EVENT = 'search:reset';
export const REFINE_EVENT = 'search:refine';
export const DIRECT_MAPPINGS = ['area', 'collection', 'language', 'fields',
  'customUrlParams', 'pruneRefinements', 'disableAutocorrection',
  'visitorId', 'sessionId'];

export class Search {

  _config: Request = <any>{};

  constructor(private flux: FluxCapacitor, private config: SearchandiserConfig, private services: Services) {
    const { sort, pageSize, pageSizes } = config;

    DIRECT_MAPPINGS.forEach((prop) => {
      if (prop in config) {
        this._config[prop] = config[prop];
      }
    });

    this._config.pageSize =  pageSize || oget(pageSizes, '[0]');
    this._config.sort = oget(sort, '[0]', oget(config, 'tags.sort.items[0].value'));

    Object.keys(this._config)
      .forEach((key) => {
        if (this._config[key] == null) {
          delete this._config[key];
        }
      });
  }

  init() {
    this.flux.on(RESET_EVENT, (newQuery) => this.reset(newQuery));
    this.flux.on(REFINE_EVENT, (newQuery) => this.refine(newQuery));
  }

  reset(newQuery: string) {
    return this.flux.reset(newQuery)
      .then(() => this.services.tracker && this.services.tracker.search());
  }

  refine([newQuery, refinement]: [string, any]) {
    return this.flux.rewrite(newQuery, { skipSearch: !!refinement })
      .then(() => refinement ? this.flux.refine(refinement) : Promise.resolve())
      .then(() => this.services.tracker && this.services.tracker.sayt());
  }
}
