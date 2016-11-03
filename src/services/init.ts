import { SearchandiserConfig } from '../searchandiser';
import { Collections } from './collections';
import { Filter } from './filter';
import { Redirect } from './redirect';
import { Tracker } from './tracker';
import { Url } from './url';
import { FluxCapacitor } from 'groupby-api';

const SERVICES = {
  collections: Collections,
  filter: Filter,
  redirect: Redirect,
  tracker: Tracker,
  url: Url
};

export interface Services {
  collections: Collections;
  filter: Filter;
  redirect: Redirect;
  tracker: Tracker;
  url: Url;
}

export interface Service {
  new (flux: FluxCapacitor, config: SearchandiserConfig, services: { [name: string]: any }): { init: () => null };
}

export function initServices(flux: FluxCapacitor, config: SearchandiserConfig) {
  const servicesConstructors: { [name: string]: Service } = Object.assign({}, SERVICES, config.services || {});
  const services: Services = <any>{};

  for (let key of Object.keys(servicesConstructors)) {
    services[key] = new servicesConstructors[key](flux, config, services);
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
