import { FluxCapacitor } from 'groupby-api';
import { initCapacitor } from '../searchandiser';

export interface FluxTag extends Riot.Tag.Instance {
  root: HTMLElement;
  flux: FluxCapacitor;
  config: any;
  _style: string;
  _parents: any;
  _scope: FluxTag;

  _clone: () => FluxCapacitor;
}

export function RootTag(flux: FluxCapacitor, config: any) {
  return {
    flux, config,
    _style: config.stylish ? 'gb-stylish' : '',
    init() {
      setParents(this);
      setScope(this);
    },
    _clone: () => initCapacitor(Object.assign({}, config, { initialSearch: false })),
    findParent: (tag: Riot.Tag.Instance, name: string) => {
      let parentTag: Riot.Tag.Instance = tag;
      while (parentTag.root.localName !== name && parentTag.parent) parentTag = parentTag.parent;
      return parentTag;
    }
  };
}

export function setParents(tag: FluxTag) {
  const htmlTagName = tag.root.tagName.toLowerCase();
  const tagName = htmlTagName.startsWith('gb-') ?
    htmlTagName :
    tag.root.dataset['is'];

  tag._parents = tag.parent ? Object.assign({}, tag.parent['_parents']) : {};
  if (tagName) tag._parents[tagName] = tag;
}

export function setScope(tag: FluxTag) {
  if (tag.opts.scope in tag._parents) tag._scope = tag._parents[tag.opts.scope];
}
