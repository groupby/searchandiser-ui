import { SearchandiserConfig } from '../searchandiser';
import { Filter } from './filter';
import { Redirect } from './redirect';
import { Url } from './url';
import { FluxCapacitor } from 'groupby-api';

export function initServices(flux: FluxCapacitor, config: SearchandiserConfig) {
  const services: any = {};

  services.filter = new Filter(flux, config);
  services.redirect = new Redirect(flux);
  services.url = new Url(flux, config);

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
