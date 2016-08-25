import { FluxCapacitor, Events } from 'groupby-api';

export function attachHandlers(flux: FluxCapacitor) {
  handleRedirect(flux);
}

export function handleRedirect(flux: FluxCapacitor) {
  flux.on(Events.REDIRECT, (redirect) => window.location.assign(redirect));
}
