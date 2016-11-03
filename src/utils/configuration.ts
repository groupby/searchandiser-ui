import { BridgeConfig } from '../searchandiser';
import { Sort } from 'groupby-api';
import oget = require('oget');

export const DEFAULT_CONFIG = {
  initialSearch: true,

  url: {
    queryParam: 'q',
    searchUrl: 'search'
  }
};

export interface ConfigurationHandler {
  <T>(config: T): T;
}

export type HandlerMap = { [key: string]: ConfigurationHandler };

export class Configuration {

  handlers: HandlerMap = {
    bridge: (cfg: BridgeConfig = {}) => {
      const headers = cfg.headers || {};
      if (cfg.skipCache) {
        headers['Skip-Caching'] = 'true';
      }
      if (cfg.skipSemantish) {
        headers['Skip-Semantish'] = 'true';
      }

      return Object.assign(cfg, { headers });
    },
    sort: (sort: Sort) => {
      if (!sort) {
        let sortOptions = oget(this.rawConfig, 'tags.sort.options');
        if (sortOptions && sortOptions.length > 0) {
          return sortOptions.map((val) => val.value)[0];
        }
      }
      return sort;
    },
    pageSize: (pageSize: number) => {
      if (!pageSize) {
        let pageSizes = this.rawConfig.pageSizes;
        if (pageSizes && pageSizes.length > 0) {
          return pageSizes[0];
        }
      }
      return pageSize;
    }
  };

  constructor(public rawConfig: any) { }

  apply() {
    Configuration.validate(this.rawConfig);
    const config = Configuration.applyDefaults(this.rawConfig, DEFAULT_CONFIG);
    return Configuration.transform(config, this.handlers);
  }

  static applyDefaults(config: any, defaults: any) {
    for (let key of Object.keys(defaults)) {
      if (typeof defaults[key] === 'object') {
        config[key] = Object.assign(config[key] || {}, defaults[key]);
      } else {
        config[key] = defaults[key];
      }
    }
    return config;
  }

  static transform(config: any, handlers: HandlerMap) {
    for (let key of Object.keys(handlers)) {
      config[key] = handlers[key](config[key]);
    }
    return config;
  }

  static validate(config: any) {
    if (!config.structure) {
      throw 'must provide a record structure';
    }
    const struct = Object.assign({}, config.structure, config.structure._variantStructure);
    if (!(struct.title && struct.title.trim())) {
      throw 'structure.title must be the path to the title field';
    }
    if (!(struct.price && struct.price.trim())) {
      throw 'structure.price must be the path to the price field';
    }
  }
}
