import { FluxCapacitor } from 'groupby-api';
import { initCapacitor } from '../searchandiser';

export interface FluxTag extends Riot.Tag.Instance {
  root: HTMLElement;
  flux: FluxCapacitor;
  config: any;
  _style: string;

  _clone: () => FluxCapacitor;
}

export function RootTag(flux: FluxCapacitor, config: any) {
  return {
    flux, config,
    _style: config.stylish ? 'gb-stylish' : '',
    _clone: () => initCapacitor(Object.assign({}, config, { initialSearch: false })),
    findParent: (tag: Riot.Tag.Instance, name: string) => {
      let parentTag: Riot.Tag.Instance = tag;
      while (parentTag.root.localName !== name && parentTag.parent) parentTag = parentTag.parent;
      return parentTag;
    }
  };
}
