import { Services } from '../services/init';
import { coerceAttributes } from '../utils/common';
import { configure, exposeAliases, setTagName } from '../utils/tag';
import { FluxCapacitor } from 'groupby-api';
import * as riot from 'riot';
import { Sayt } from 'sayt';

const sayt = new Sayt();

export interface FluxTag<T> extends riot.Tag.Instance {
  parent: FluxTag<any> & any;

  flux: FluxCapacitor;
  services: Services;
  config: any;

  onConfigure(opts: any): void;
}

export class FluxTag<T> {
  _tagName: string;
  _aliases: any;
  _dependencies: any;
  _types: TypeMap;
  // TODO: should get rid of this
  _style: string;

  init() {
    this._dependencies = {};
    this._types = {};
    this._style = this.config.stylish ? 'gb-stylish' : '';
    setTagName(this);
    exposeAliases(this);

    this.on('before-mount', () => configure(this));
  }

  expose(aliases: string | string[], obj: any = this) {
    if (!Array.isArray(aliases)) {
      aliases = [aliases];
    }
    aliases.forEach((alias) => this[`$${alias}`] = this._aliases[alias] = obj);
  }

  unexpose(alias: string) {
    delete this._aliases[alias];
  }

  depend(alias: string, options: DependencyOptions, transform: (obj: any) => any = (obj) => obj) {
    this._types = options.types || {};
    this._dependencies[alias] = transform;
  }

  _mixin(...mixins: any[]) {
    this.mixin(...mixins.map((mixin) => new mixin().__proto__));
  }
}

export interface SaytTag<T> extends FluxTag<T> { }

export class SaytTag<T> {

  sayt: any;

  init() {
    this.sayt = sayt;
  }
}

export interface TypeMap { [key: string]: string; }
export interface ConfigureOptions {
  defaults?: any;
  services?: string[];
  types?: TypeMap;
}
export interface DependencyOptions {
  defaults?: any;
  types?: TypeMap;
}
export interface TagConfigure {
  (opts: ConfigureOptions): any;
}

export function mixinDependencies(tag: FluxTag<any>, options: DependencyOptions = {}) {
  Object.keys(tag._dependencies).forEach((key) => {
    if (tag._aliases[key]) {
      const coercedOpts = coerceAttributes(tag.opts, tag._types);
      Object.assign(tag, tag._dependencies[key](tag._aliases[key]), coercedOpts);
    }
  });
}
