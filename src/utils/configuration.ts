import { BridgeConfig, StoreFrontConfig } from '../searchandiser';

export const DEFAULT_CONFIG: StoreFrontConfig = <any>{
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

namespace Configuration {

  export const handlers: HandlerMap = {
    bridge: (config: BridgeConfig = {}) => {
      const headers = config.headers || {};
      if (config.skipCache) {
        headers['Skip-Caching'] = 'true';
      }
      if (config.skipSemantish) {
        headers['Skip-Semantish'] = 'true';
      }

      return Object.assign(config, { headers });
    }
  };

  export function apply(rawConfig: StoreFrontConfig) {
    Configuration.validate(rawConfig);
    const config = Configuration.applyDefaults(rawConfig, DEFAULT_CONFIG);
    return Configuration.transform(config);
  }

  export function applyDefaults(config: StoreFrontConfig, defaults: StoreFrontConfig) {
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

  export function transform(config: StoreFrontConfig) {
    for (let key of Object.keys(Configuration.handlers)) {
      config[key] = handlers[key](config[key]);
    }
    return config;
  }

  export function validate(config: StoreFrontConfig) {
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

export default Configuration;
