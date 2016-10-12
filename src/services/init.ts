import { SearchandiserConfig } from '../searchandiser';
import { Collections } from './collections';
import { Filter } from './filter';
import { Redirect } from './redirect';
import { Tracker } from './tracker';
import { Url } from './url';
import { FluxCapacitor } from 'groupby-api';

export interface Services {
  collections: Collections;
  filter: Filter;
  redirect: Redirect;
  tracker: Tracker;
  url: Url;
}

export function initServices(flux: FluxCapacitor, config: SearchandiserConfig) {
  const services: Services = <any>{};

  services.collections = new Collections(flux, config);
  services.filter = new Filter(flux, config);
  services.redirect = new Redirect(flux);
  services.tracker = new Tracker(flux, config);
  services.url = new Url(flux, config, services);

  startServices(services);
  return services;
}

export function startServices(services: any) {
  for (let service in services) {
    if (services.hasOwnProperty(service)) {
      services[service].init();
    }
  }
}
