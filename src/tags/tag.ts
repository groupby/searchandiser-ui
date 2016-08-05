import { FluxCapacitor } from 'groupby-api';
import { initCapacitor } from '../searchandiser';

export interface FluxTag extends Riot.Tag.Instance {
  root: HTMLElement;
  flux: FluxCapacitor;
  config: any;
  _style: string;

  _clone: () => FluxCapacitor;
}

initCapacitor(Object.assign({}, this.config, { initialSearch: false }))

export function RootTag(flux: FluxCapacitor, config: any) {

  return {
    flux, config,
    _style: config.stylish ? 'gb-stylish' : '',
    _clone: () => initCapacitor(Object.assign({}, config, { initialSearch: false }))
  };

}
