import { Services } from '../services/init';
import { checkBooleanAttr, getPath } from '../utils/common';
import { FluxCapacitor } from 'groupby-api';
import * as riot from 'riot';
import { Sayt } from 'sayt';

const sayt = new Sayt();

export interface FluxTag<T> extends riot.Tag.Instance {
  parent: FluxTag<any> & any;

  flux: FluxCapacitor;
  services: Services;
  config: any;
}

export class FluxTag<T> {
  _tagName: string;
  _simpleTagName: string;
  _camelTagName: string;
  _parents: any;
  _parentsList: any[];
  _scope: FluxTag<any> & any;
  _top: FluxTag<any> & any;
  _style: string;
  _config: T;

  init() {
    this._style = this.config.stylish ? 'gb-stylish' : '';
    setTagName(this);
    setParents(this);
    setScope(this);
  }

  _mixin(...mixins: any[]) {
    this.mixin(...mixins.map((mixin) => new mixin().__proto__));
  }

  _scopeTo(scope: string) {
    this._scope = this._parents[scope];
  }

  findParent(tag: FluxTag<any>, name: string) {
    let parentTag = tag;
    while (parentTag.root.localName !== name && parentTag.parent) {
      parentTag = parentTag.parent;
    }
    return parentTag;
  }

  configure(defaultConfig: any = {}) {
    configure(defaultConfig, this);
  }
}

export interface SaytTag<T> extends FluxTag<T> { }

export class SaytTag<T> {

  sayt: any;

  init() {
    this.sayt = sayt;
  }
}

export function setTagName(tag: FluxTag<any>) {
  const htmlTagName = tag.root.tagName.toLowerCase();
  let tagName = htmlTagName;

  if (htmlTagName.indexOf('-') === -1) {
    tagName = tag.root.dataset['is'];
  }

  if (tagName) {
    tag._tagName = tagName;
    tag._simpleTagName = tag._tagName.replace(/^[a-z]*?-/, '');
    tag._camelTagName = tag._simpleTagName.replace(/-([a-z])/g, (match) => match[1].toUpperCase());
  }
}

export function setParents(tag: FluxTag<any>) {
  tag._parents = tag.parent ? Object.assign({}, tag.parent['_parents']) : {};
  if (tag._tagName) {
    tag._parents[tag._tagName] = tag;
  }

  tag._parentsList = [];
  let currTag = tag;
  while (currTag = currTag.parent) tag._parentsList.push(currTag);
}

// somehow this function isn't working for the gb-select inside gb-sort
export function setScope(tag: FluxTag<any>) {
  if (tag._parents && tag._parents[tag.opts.scope]) {
    tag._scope = tag._parents[tag.opts.scope];
  } else if (tag.parent && tag.parent._scope) {
    tag._scope = tag.parent._scope;
  } else {
    let parent: any = tag;
    while (parent.parent) tag._scope = parent = parent.parent;
    tag._top = tag._scope;
  }
}

export function configure(defaultConfig: any = {}, tag: FluxTag<any>) {
  const rawConfig = Object.assign(
    {},
    defaultConfig,
    getPath(tag.config, `tags.${tag._camelTagName}`),
    tag.opts.__proto__,
    tag.opts);
  for (let key of Object.keys(rawConfig)) {
    if (typeof defaultConfig[key] === 'boolean'
      || (typeof defaultConfig[key] !== 'number' && rawConfig[key] == true) // tslint:disable-line:triple-equals
      || (!Array.isArray(rawConfig[key]) && typeof defaultConfig[key] !== 'number' && rawConfig[key] == false)) { // tslint:disable-line:triple-equals max-line-length
      rawConfig[key] = checkBooleanAttr(key, rawConfig);
    }
  }
  tag._config = rawConfig;
}

export function MixinFlux(flux: FluxCapacitor, config: any, services: any): FluxTag<any> {
  return Object.assign(new FluxTag()['__proto__'], { flux, config, services });
}
