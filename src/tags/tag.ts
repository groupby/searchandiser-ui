import { Collections } from '../services/collections';
import { Filter } from '../services/filter';
import { Redirect } from '../services/redirect';
import { Url } from '../services/url';
import { checkBooleanAttr, getPath } from '../utils/common';
import { FluxCapacitor } from 'groupby-api';
import * as riot from 'riot';
import { Sayt } from 'sayt';

const sayt = new Sayt();

export interface FluxTag<T> extends riot.Tag.Instance {
  parent: riot.Tag.Instance & FluxTag<any> & any;

  flux: FluxCapacitor;
  config: any;
  services: {
    collections: Collections;
    filter: Filter;
    redirect: Redirect;
    url: Url;
  };
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

  findParent(tag: riot.Tag.Instance, name: string) {
    let parentTag: riot.Tag.Instance = tag;
    while (parentTag.root.localName !== name && parentTag.parent) {
      parentTag = parentTag.parent;
    }
    return parentTag;
  }

  configure(defaultConfig: any = {}) {
    const rawConfig = Object.assign(
      {},
      defaultConfig,
      getPath(this.config, `tags.${this._camelTagName}`),
      this.opts.__proto__,
      this.opts);
    for (let key of Object.keys(rawConfig)) {
      if (typeof defaultConfig[key] === 'boolean') {
        rawConfig[key] = checkBooleanAttr(key, rawConfig);
      }
    }
    this._config = rawConfig;
  }
}

export interface SaytTag<T> extends FluxTag<T> { }

export class SaytTag<T> {

  sayt: any;

  init() {
    this.sayt = sayt;
  }
}

function setTagName(tag: FluxTag<any>) {
  const htmlTagName = tag.root.tagName.toLowerCase();
  const tagName = htmlTagName.startsWith('gb-') ?
    htmlTagName :
    tag.root.dataset['is'] || tag.root.getAttribute('riot-tag');

  if (tagName) {
    tag._tagName = tagName;
    tag._simpleTagName = tag._tagName.replace(/^gb-/, '');
    tag._camelTagName = tag._simpleTagName.replace(/-([a-z])/g, (match) => match[1].toUpperCase());
  }
}

function setParents(tag: FluxTag<any>) {
  tag._parents = tag.parent ? Object.assign({}, tag.parent['_parents']) : {};
  if (tag._tagName) {
    tag._parents[tag._tagName] = tag;
  }

  tag._parentsList = [];
  let currTag = tag;
  while (currTag = currTag.parent) tag._parentsList.push(currTag);
}

// somehow this function isn't working for the gb-select inside gb-sort
function setScope(tag: FluxTag<any>) {
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

export function MixinFlux(flux: FluxCapacitor, config: any, services: any) {
  return Object.assign(new FluxTag()['__proto__'], { flux, config, services });
}
