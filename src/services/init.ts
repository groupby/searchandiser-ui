import { SearchandiserConfig } from '../searchandiser';
import { Collections } from './collections';
import { Filter } from './filter';
import { Redirect } from './redirect';
import { Tracker } from './tracker';
import { Url } from './url';
import { FluxCapacitor } from 'groupby-api';

const SERVICES = {
  redirect: Redirect,
  tracker: Tracker,
  url: Url
};

const CORE_SERVICES = {
  collections: Collections,
  filter: Filter
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

type ServiceMap = { [name: string]: Service };

export function initServices(flux: FluxCapacitor, config: SearchandiserConfig) {
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
