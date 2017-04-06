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

    this._config.pageSize = pageSize || oget(pageSizes, '[0]');
    this._config.sort = oget(sort, '[0]', oget(config, 'tags.sort.items[0].value'));

    Object.keys(this._config)
      .forEach((key) => {
        if (this._config[key] == null) {
          delete this._config[key];
        }
      });
  }

  init() {
    this.flux.on(RESET_EVENT, (data) => this.reset(data));
    this.flux.on(REFINE_EVENT, (data) => this.refine(data));
  }

  reset(data: ResetAction) {
    const { query, origin = 'search' } = typeof data === 'string' ? { query: data } : data;

    return this.flux.reset(query)
      .then(() => this.emit(origin))
      .then(() => this.services.url.update(this.flux.query));
  }

  refine({ query, refinement, refinements, origin = 'search', _skip = false }: RefineAction) {
    const refs = refinement ? [refinement] : (refinements || []);
    return this.flux.rewrite(query, { skipSearch: !!refs.length })
      .then(() => refs.length && refs.forEach((ref, index) =>
        this.flux.refine(ref, { skipSearch: index < refs.length - 1 })))
      .then(() => this.emit(origin))
      .then(() => !_skip && this.services.url.update(this.flux.query));
  }

  emit(event: string) {
    if (this.services.tracker) {
      switch (typeof event) {
        case 'string': return this.services.tracker[event]
          ? this.services.tracker[event]()
          : this.services.tracker.sendSearchEvent(event);
        default: return console.error('event must be a string');
      }
    }
  }
}

export type ResetAction = string | {
  query: string;
  origin?: string;
}

export interface RefineAction {
  query: string;
  _skip: boolean;
  refinement?: any;
  refinements?: any[];
  origin?: string;
}
