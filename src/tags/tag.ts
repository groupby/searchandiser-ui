import { FluxCapacitor } from 'groupby-api';
import { expect } from 'chai';
import { initCapacitor } from '../searchandiser';
const sayt = require('sayt');

export interface FluxTag extends Riot.Tag.Instance {
  root: HTMLElement;
  parent: Riot.Tag.Instance & FluxTag & any;

  flux: FluxCapacitor;
  config: any;
}

export class FluxTag {
  _tagName: string;
  _simpleTagName: string;
  _parents: any;
  _parentsList: any[];
  _scope: FluxTag & any;
  _top: FluxTag & any;
  _style: string;

  init() {
    this._style = this.config.stylish ? 'gb-stylish' : '';
    setTagName(this);
    setParents(this);
    setScope(this);
  }

  _mixin(...mixins: any[]) {
    this.mixin(...mixins.map((Mixin) => new Mixin().__proto__));
  }

  _clone() {
    return initCapacitor(Object.assign({}, this.config, { initialSearch: false }));
  }

  _scopeTo(scope: string) {
    this._scope = this._parents[scope];
  }

  findParent(tag: Riot.Tag.Instance, name: string) {
    let parentTag: Riot.Tag.Instance = tag;
    while (parentTag.root.localName !== name && parentTag.parent) parentTag = parentTag.parent;
    return parentTag;
  }
}

export interface SaytTag extends FluxTag { }

export class SaytTag {

  sayt: any;

  init() {
    this.sayt = sayt;
  }
}

function setTagName(tag: FluxTag) {
  const htmlTagName = tag.root.tagName.toLowerCase();
  const tagName = htmlTagName.startsWith('gb-') ?
    htmlTagName :
    tag.root.dataset['is'] || tag.root.getAttribute('riot-tag');

  if (tagName) {
    tag._tagName = tagName;
    tag._simpleTagName = tag._tagName.replace(/^gb-/, '');
  }
}

function setParents(tag: FluxTag) {
  tag._parents = tag.parent ? Object.assign({}, tag.parent['_parents']) : {};
  if (tag._tagName) {
    tag._parents[tag._tagName] = tag;
  }

  tag._parentsList = [];
  let currTag = tag;
  while (currTag = currTag.parent) tag._parentsList.push(currTag);
}

// somehow this function isn't working for the gb-select inside gb-sort
function setScope(tag: FluxTag) {
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

export function MixinFlux(flux: FluxCapacitor, config: any) {
  return Object.assign(new FluxTag()['__proto__'], { flux, config });
}
