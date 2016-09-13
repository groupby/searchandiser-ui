import { WINDOW } from '../utils';
import { Events, FluxCapacitor } from 'groupby-api';

export class Redirect {

  constructor(private flux: FluxCapacitor, private config: any) { }

  init() {
    this.flux.on(Events.REDIRECT, (redirect) => WINDOW.assign(redirect));
  }
}
