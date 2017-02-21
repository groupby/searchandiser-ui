import { BridgeConfig, SearchandiserConfig } from '../searchandiser';
import { Sort } from 'groupby-api';
import oget = require('oget');

export const DEFAULT_CONFIG: SearchandiserConfig = <any>{
  pageSize: 10,
  sort: [],

  simpleAttach: true,

  url: {
    queryParam: 'q',
    searchUrl: 'search'
  }
};

export interface ConfigurationHandler {
  <T>(configOrValue: T): T;
}

export type HandlerMap = { [key: string]: ConfigurationHandler };

export class Configuration {

  handlers: HandlerMap = {
    bridge: (config: BridgeConfig = {}) => {
      const headers = config.headers || {};
      if (config.skipCache) {
        headers['Skip-Caching'] = 'true';
      }
      if (config.skipSemantish) {
        headers['Skip-Semantish'] = 'true';
      }

      return Object.assign(config, { headers });
    },
    sort: (sort: Sort) => {
      if (!sort) {
        const sortItems = oget(this.rawConfig, 'tags.sort.items');
        if (sortItems && sortItems.length > 0) {
          [sort] = sortItems.map((val) => val.value);
        }
      }
      return Array.isArray(sort) ? sort : [sort];
    },
    pageSize: (pageSize: number) => {
      if (!pageSize) {
        const pageSizes = this.rawConfig.pageSizes;
        if (pageSizes && pageSizes.length > 0) {
          pageSize = pageSizes[0];
        }
      }
      return pageSize;
    }
  };

  constructor(public rawConfig: SearchandiserConfig) { }

  apply() {
    Configuration.validate(this.rawConfig);
    const config = Configuration.applyDefaults(this.rawConfig, DEFAULT_CONFIG);
    return Configuration.transform(config, this.handlers);
  }

  static applyDefaults(config: SearchandiserConfig, defaults: SearchandiserConfig) {
    const finalConfig = Object.assign({}, defaults);
    for (let key of Object.keys(config)) {
      if (Array.isArray(config[key]) || typeof config[key] !== 'object') {
        finalConfig[key] = config[key];
      } else {
        finalConfig[key] = Object.assign(finalConfig[key] || {}, config[key]);
      }
    }
    return finalConfig;
  }

  static transform(config: SearchandiserConfig, handlers: HandlerMap) {
    for (let key of Object.keys(handlers)) {
      config[key] = handlers[key](config[key]);
    }
    return config;
  }

  static validate(config: SearchandiserConfig) {
    if (!config.structure) {
      throw new Error('must provide a record structure');
    }
    const struct = Object.assign({}, config.structure, config.structure._variantStructure);
    if (!(struct.title && struct.title.trim())) {
      throw new Error('structure.title must be the path to the title field');
    }
    if (!(struct.price && struct.price.trim())) {
      throw new Error('structure.price must be the path to the price field');
    }
  }
}
