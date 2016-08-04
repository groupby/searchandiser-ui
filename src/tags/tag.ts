import { FluxCapacitor } from 'groupby-api';

export interface FluxTag extends Riot.Tag.Instance {
  root: HTMLElement;
  flux: FluxCapacitor;
  config: any;
  _style: string;
}


export function RootTag(flux: FluxCapacitor, config: any) {

  return {
    flux, config,
    _style: config.stylish ? 'gb-stylish' : ''
  };

}
