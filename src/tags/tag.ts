import { FluxCapacitor } from 'groupby-api';
import { expect } from 'chai';
import { initCapacitor } from '../searchandiser';

export interface FluxTag extends Riot.Tag.Instance {
  root: HTMLElement;
  parent: Riot.Tag.Instance & FluxTag & any;
  flux: FluxCapacitor;
  config: any;
  _style: string;
  _parents: any;
  _scope: FluxTag & any;
  _top: FluxTag & any;

  _clone: () => FluxCapacitor;
  _scopeTo: (scope: string) => void;
}

export function RootTag(flux: FluxCapacitor, config: any) {
  return {
    flux, config,
    _style: config.stylish ? 'gb-stylish' : '',
    init() {
      setParents(this);
      setScope(this);
    },
    _scopeTo(scope: string) {
      this._scope = this._parents[scope];
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

// somehow this function isn't working for the gb-select inside gb-sort
export function setScope(tag: FluxTag) {
  if (tag.opts.scope in tag._parents) {
    tag._scope = tag._parents[tag.opts.scope];
  } else if (tag.parent && tag.parent._scope) {
    tag._scope = tag.parent._scope;
  } else {
    let parent: any = tag;
    while (parent.parent) tag._scope = parent = parent.parent;
    tag._top = tag._scope;
  }
}
