import { Events, FluxCapacitor, FluxConfiguration, Sort } from 'groupby-api';
import { initialize as initServices, Service } from './services';
import { TrackerConfig } from './services/tracker';
import { UrlConfig } from './services/url';
import { Config as TagConfig } from './tags';
import { riot } from './utils/common';
import Configuration from './utils/configuration';
import { ProductStructure } from './utils/product-transformer';
import { MixinFlux } from './utils/tag';

export function initStoreFront() {
  return function configure(rawConfig: StoreFront.Config) {
    const config = Configuration.build(rawConfig);

    const flux = new FluxCapacitor(config);
    Object.assign(flux, Events);
    const services = initServices(flux, config);

    // flux.query.withConfiguration(services.search._config);
    riot.mixin(MixinFlux(flux, config, services));
    Object.assign(configure, { flux, services, config }, new StoreFront()['__proto__']);
    // (<any>configure).init();

    // tslint:disable-next-line:no-console
    console.log(`StoreFront v${configure['version']} Loaded 🏬`);
  };
}

export class StoreFront {

  config: StoreFront.Config;
  flux: FluxCapacitor;
  services: any;

  // init() {
  //   if (this.config.options.initialSearch) {
  //     this.search();
  //   }
  // }

  attach(tagName: string, opts?: any);
  attach(tagName: string, cssSelector: string, opts?: any);
  attach(tagName: string, selectorOrOpts?: any, options?: any) {
    const tag = typeof selectorOrOpts === 'string'
      ? this.cssAttach(tagName, selectorOrOpts, options)
      : this.simpleAttach(tagName, selectorOrOpts);

    if (tag) {
      return tag.length === 1 ? tag[0] : tag;
    } else {
      return null;
    }
  }

  compile(onCompile: () => void) {
    riot.compile(onCompile);
  }

  search(query?: string) {
    this.flux.search(query);
  }

  private simpleAttach(tagName: string, options: any = {}) {
    return riot.mount(this.riotTagName(tagName), options);
  }

  private cssAttach(tagName: string, cssSelector: string = `.${tagName}`, options: any = {}) {
    return riot.mount(cssSelector, this.riotTagName(tagName), options);
  }

  private riotTagName(tagName: string) {
    return (tagName.startsWith('gb-') || !this.config.options.simpleAttach) ? tagName : `gb-${tagName}`;
  }
}

export namespace StoreFront {
  export interface Config extends FluxConfiguration {
    structure?: ProductStructure;

    tags?: Partial<TagConfig>;

    // expand this to include service configuration
    services?: { [name: string]: Service | false | object };

    options?: {
      stylish?: boolean;
      initialSearch?: boolean;
      simpleAttach?: boolean;
    };
  }
}
