import { ConfigureOptions, FluxTag, TagConfigure } from '../tags/tag';
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

export function configure(tag: FluxTag<any>) {
  const doConfigure: TagConfigure = (options: ConfigureOptions) => {
    const defaultConfig = options.defaults || {};
    const types = options.types || {};
    const services = options.services || [];

    const serviceConfigs = collectServiceConfigs(tag, services);

    const globalTagConfig = oget(tag.config, `tags.${camelizeTagName(tag._tagName)}`, {});

    const coercedOpts = coerceAttributes(tag.opts, types);

    const config = Object.assign(
      {},
      defaultConfig,
      ...serviceConfigs,
      globalTagConfig,
      tag.opts.__proto__,
      coercedOpts
    );

    Object.assign(tag, config);

    return config;
  };
  if (typeof tag.onConfigure === 'function') {
    tag.onConfigure(doConfigure);
  }
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
