import { FluxCapacitor } from 'groupby-api';
import { StoreFrontConfig } from '../searchandiser';
import { FluxTag } from '../tags/tag';
import { Collections } from './collections';
import { Filter } from './filter';
import { Redirect } from './redirect';
import { Search } from './search';
import { Tracker } from './tracker';
import { Url } from './url';

const SERVICES = {
  redirect: Redirect,
  tracker: Tracker,
  url: Url
};

const CORE_SERVICES = {
  collections: Collections,
  filter: Filter,
  search: Search
};

export interface LazyService {

  registered: FluxTag<any>[];
  register(tag: FluxTag<any>): void;
  unregister(tag: FluxTag<any>): void;
}

export interface LazyInitializer {

  lazyInit(): void;
}

export function lazyMixin(service: any) {
  Object.assign(service, {
    registered: [],
    register(tag: FluxTag<any>) {
      if (!this.registered.length) {
        this.lazyInit();
      }
      this.registered.push(tag);
    },
    unregister(tag: FluxTag<any>) {
      const index = this.registered.findIndex((registered) => registered === tag);
      if (index >= 0) {
        this.registered.splice(index, 1);
      }
    }
  });
}

export interface Services {
  collections: Collections;
  filter: Filter;
  redirect: Redirect;
  search: Search;
  tracker: Tracker;
  url: Url;
}

export interface Service {
  new (flux: FluxCapacitor, config: StoreFrontConfig, services: { [name: string]: any }): { init: () => null };
}

type ServiceMap = { [name: string]: Service };

export function initServices(flux: FluxCapacitor, config: StoreFrontConfig) {
  const servicesConstructors: ServiceMap = Object.assign({}, SERVICES, config.services || {}, CORE_SERVICES);
  const services: Services = <any>{};

  for (let key of Object.keys(servicesConstructors)) {
    const Service = servicesConstructors[key]; // tslint:disable-line:variable-name
    if (Service) {
      services[key] = new Service(flux, config, services);
    }
  }

  startServices(services);
  return services;
}

export function startServices(services: any) {
  for (let key of Object.keys(services)) {
    if (services[key]) {
      services[key].init();
    }
  }
}
