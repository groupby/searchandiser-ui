import { SearchandiserConfig } from '../searchandiser';
import { Redirect } from './redirect';
import { UrlParser } from './url-parser';
import { FluxCapacitor } from 'groupby-api';

export function initServices(flux: FluxCapacitor, config: SearchandiserConfig) {
  const services: any = {};

  services.redirect = new Redirect(flux);
  services.urlParser = new UrlParser(flux, config);

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
