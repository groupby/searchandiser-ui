import { Services } from '../services/init';
import { checkBooleanAttr, getPath } from '../utils/common';
import { FluxCapacitor } from 'groupby-api';
import * as riot from 'riot';
import { Sayt } from 'sayt';

const TAG_PREFIX_REGEX = /^[a-z]*?-/;
const TAG_WORD_BREAK_REGEX = /-([a-z])/g;

const sayt = new Sayt();

export interface FluxTag<T> extends riot.Tag.Instance {
  parent: FluxTag<any> & any;

  flux: FluxCapacitor;
  services: Services;
  config: any;
}

export class FluxTag<T> {
  _tagName: string;
  // TODO: should get rid of this
  _parents: any;
  _aliases: any;
  // TODO: should get rid of this
  _scope: FluxTag<any> & any;
  _style: string;
  _config: T;

  init() {
    this._style = this.config.stylish ? 'gb-stylish' : '';
    setTagName(this);
    // TODO: should get rid of this
    setParents(this);
    // TODO: should get rid of this
    setScope(this);
    setAliases(this);
  }

  alias(aliases: string | string[], obj: any = this) {
    if (!Array.isArray(aliases)) {
      aliases = [aliases];
    }
    aliases.forEach((alias) => this[`$${alias}`] = this._aliases[alias] = obj);
  }

  unalias(alias: string) {
    delete this._aliases[alias];
  }

  _mixin(...mixins: any[]) {
    this.mixin(...mixins.map((mixin) => new mixin().__proto__));
  }

  // TODO: should get rid of this
  _scopeTo(scope: string) {
    this._scope = this._parents[scope];
  }

  // TODO: should get rid of this
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
  }
}

export function setParents(tag: FluxTag<any>) {
  tag._parents = tag.parent ? Object.assign({}, tag.parent['_parents']) : {};
  if (tag._tagName) {
    tag._parents[tag._tagName] = tag;
  }
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
  }
}

export function setAliases(tag: FluxTag<any>) {
  let aliases = {};
  if (tag.parent && tag.parent._aliases) {
    Object.assign(aliases, tag.parent._aliases);
  }

  if (tag.opts.alias) {
    aliases[tag.opts.alias] = tag;
  }

  Object.assign(tag, addDollarSigns(aliases));

  tag._aliases = aliases;
}

export function addDollarSigns(obj: any) {
  return Object.keys(obj)
    .reduce((renamed, key) => Object.assign(renamed, { [`$${key}`]: obj[key] }), {});
}

export function configure(defaultConfig: any = {}, tag: FluxTag<any>) {
  const rawConfig = Object.assign(
    {},
    defaultConfig,
    getPath(tag.config, `tags.${camelizeTagName(tag._tagName)}`),
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

export function camelizeTagName(tagName: string) {
  return tagName.replace(TAG_PREFIX_REGEX, '')
    .replace(TAG_WORD_BREAK_REGEX, (match) => match[1].toUpperCase());
}

export function MixinFlux(flux: FluxCapacitor, config: any, services: any): FluxTag<any> {
  return Object.assign(new FluxTag()['__proto__'], { flux, config, services });
}
