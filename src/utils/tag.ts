import { FluxTag } from '../tags/tag';
import { checkBooleanAttr } from './common';
import { FluxCapacitor } from 'groupby-api';
import oget = require('oget');

const TAG_PREFIX_REGEX = /^[a-z]*?-/;
const TAG_WORD_BREAK_REGEX = /-([a-z])/g;

export interface TypeMap { [key: string]: 'number' | 'boolean'; }
export interface ConfigureOptions {
  defaults?: any;
  services?: string[];
  types?: TypeMap;
}
export interface TagConfigure {
  (opts: ConfigureOptions): void;
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
  const doConfigure: TagConfigure = (opts: ConfigureOptions) => {
    const defaultConfig = opts.defaults || {};
    const types = opts.types || {};
    const services = opts.services || [];

    const serviceConfigs = services.reduce((configs, service) => {
      const config = oget(tag.services, `${service}._config`);
      if (config) {
        configs.push(config);
      }
      return configs;
    }, []);

    const globalTagConfig = oget(tag.config, `tags.${tag._tagName}`, {});

    const coercedOpts = Object.keys(tag.opts)
      .reduce((coerced, key) => {
        switch (types[key]) {
          case 'boolean':
            const attr = checkBooleanAttr(key, tag.opts, undefined);
            return attr !== undefined ? Object.assign(coerced, { [key]: attr }) : coerced;
          default:
            return Object.assign(coerced, { [key]: tag.opts });
        }
      }, {});

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
