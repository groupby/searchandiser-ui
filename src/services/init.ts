import { Redirect } from './redirect';
import { FluxCapacitor } from 'groupby-api';

export function initServices(flux: FluxCapacitor, config: any) {
  const services: any = {};

  services.redirect = new Redirect(flux, config);

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
