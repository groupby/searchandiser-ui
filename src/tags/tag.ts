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

  onMount(): void;
}

export class FluxTag<T> {
  $stylish: boolean;
  $tagName: string;
  $parents: any;
  $scope: FluxTag<any> & any;
  $scopes: { [key: string]: any };
  $config: T;

  init() {
    setTagName(this);
    setParents(this);
    setScope(this);

    this.on('mount', () => onMount(this));
  }

  $mixin(...mixins: any[]) {
    if (mixins.length === 0) {
      const tagDir = this.$tagName.replace(/^[a-z]*?-/, '');
      const tagModule = require(`./${tagDir}/${this.$tagName}.ts`);
      const tagClassName = tagDir.replace(/\b(\w)/g, (match) => match.toUpperCase())
        .replace(/-/g, '');
      if (tagClassName in tagModule) {
        mixin(this, tagModule[tagClassName]);
      }
    } else {
      mixin(this, ...mixins);
    }
  }

  $scopeTo(scope: string) {
    this.$scope = this.$parents[scope];
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
    tag.$tagName = tagName;
  }
}

export function setParents(tag: FluxTag<any>) {
  tag.$parents = tag.parent ? Object.assign({}, tag.parent['$parents']) : {};
  if (tag.$tagName) {
    tag.$parents[tag.$tagName] = tag;
  }
}

// somehow this function isn't working for the gb-select inside gb-sort
export function setScope(tag: FluxTag<any>) {
  if (tag.$parents && tag.$parents[tag.opts.scope]) {
    tag.$scope = tag.$parents[tag.opts.scope];
  } else if (tag.parent && tag.parent.$scope) {
    tag.$scope = tag.parent.$scope;
  } else {
    let parent: any = tag;
    while (parent.parent) tag.$scope = parent = parent.parent;
  }
}

export function configure(defaultConfig: any = {}, tag: FluxTag<any>) {
  const rawConfig = Object.assign(
    {},
    defaultConfig,
    getPath(tag.config, `tags.${camelizeTagName(tag.$tagName)}`),
    tag.opts.__proto__,
    tag.opts);
  for (let key of Object.keys(rawConfig)) {
    if (typeof defaultConfig[key] === 'boolean'
      || (typeof defaultConfig[key] !== 'number' && rawConfig[key] == true) // tslint:disable-line:triple-equals
      || (!Array.isArray(rawConfig[key]) && typeof defaultConfig[key] !== 'number' && rawConfig[key] == false)) { // tslint:disable-line:triple-equals max-line-length
      rawConfig[key] = checkBooleanAttr(key, rawConfig);
    }
  }
  tag.$config = rawConfig;
}

export function mixin(tag: FluxTag<any>, ...mixins: any[]) {
  tag.mixin(...mixins.map((mixin) => new mixin().__proto__));
}

export function onMount(tag: FluxTag<any>) {
  let stylish = checkBooleanAttr('stylish', tag.config);
  if ('stylish' in tag.opts) {
    stylish = checkBooleanAttr('stylish', tag.opts);
  } else if (tag.parent) {
    stylish = tag.parent.$stylish;
  }

  if (stylish) {
    tag.$stylish = stylish;
    tag.root.classList.add('gb-stylish');
  }
  if (typeof tag.onMount === 'function') { tag.onMount(); }
}

export function camelizeTagName(tagName: string) {
  return tagName.replace(/^[a-z]*?-/, '')
    .replace(/-([a-z])/g, (match) => match[1].toUpperCase());
}

export function MixinFlux(flux: FluxCapacitor, config: any, services: any): FluxTag<any> {
  return Object.assign(new FluxTag()['__proto__'], { flux, config, services });
}
