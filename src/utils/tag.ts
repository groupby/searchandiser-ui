import { Dependency, DependencyOptions, FluxTag, META, TagMeta } from '../tags/tag';
import { coerceAttributes, collectServiceConfigs } from './common';
import { FluxCapacitor } from 'groupby-api';
import oget = require('oget');

const TAG_PREFIX_REGEX = /^[a-z]*?-/;
const TAG_WORD_BREAK_REGEX = /-([a-z])/g;

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

export function inheritAliases(tag: FluxTag<any>) {
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

export function configure(tag: FluxTag<any>) {
  let meta = {};
  if (tag[META]) {
    meta = tag[META];
  }

  const config = buildConfiguration(tag, meta);
  if (typeof tag.setDefaults === 'function') {
    tag.setDefaults(config);
  }
  Object.assign(tag, config);
  return config;
}

export function buildConfiguration(tag: FluxTag<any>, meta: TagMeta) {
  const defaultConfig = meta.defaults || {};
  const types = meta.types || {};
  const services = meta.services || [];

  const serviceConfigs = collectServiceConfigs(tag, services);

  const globalTagConfig = tag._tagName ? oget(tag.config, `tags.${camelizeTagName(tag._tagName)}`, {}) : {};

  const coercedOpts = coerceAttributes(tag.opts, types);

  return Object.assign(
    {},
    defaultConfig,
    ...serviceConfigs,
    globalTagConfig,
    tag.opts.__proto__,
    coercedOpts
  );
}

export function updateDependency(tag: FluxTag<any>, dependency: Dependency, options: DependencyOptions = {}) {
  const parentAlias = tag.parent ? tag.parent._aliases[dependency.alias] : undefined;
  const coercedOpts = coerceAttributes(tag.opts, options.types || {});
  const updated = Object.assign(
    {},
    options.defaults,
    parentAlias,
    coercedOpts
  );
  const transformed = dependency.transform(updated);
  tag.expose(dependency.realias, transformed);
  if (dependency.alias !== dependency.realias) {
    tag.expose(dependency.alias, transformed);
  }
}

export function addMeta(tag: FluxTag<any>, meta: any, ...properties: string[]) {
  if (!tag[META]) {
    tag[META] = {};
  }
  properties.forEach((property) => {
    if (meta[property]) {
      tag[META][property] = meta[property];
    }
  });
}

export function addDollarSigns(obj: any) {
  return Object.keys(obj)
    .reduce((renamed, key) => Object.assign(renamed, { [`$${key}`]: obj[key] }), {});
}

export function camelizeTagName(tagName: string) {
  return tagName.replace(TAG_PREFIX_REGEX, '')
    .replace(TAG_WORD_BREAK_REGEX, (match) => match[1].toUpperCase());
}

export function MixinFlux(flux: FluxCapacitor, config: any, services: any): FluxTag<any> {
  return Object.assign(new FluxTag()['__proto__'], { flux, config, services });
}
