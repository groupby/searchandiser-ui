import { LOCATION } from '../utils/common';
import { Events, FluxCapacitor } from 'groupby-api';

export class Redirect {

  constructor(private flux: FluxCapacitor) { }

  init() {
    this.flux.on(Events.REDIRECT, (redirect) => this.redirect(redirect));
  }

  redirect(url: string) {
    LOCATION.assign(url);
  }
}
