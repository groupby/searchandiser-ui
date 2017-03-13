import { SearchandiserConfig } from '../searchandiser';
import { Services } from '../services/init';
import { addMeta, configure, inheritAliases, setStylish, setTagName, updateDependency } from '../utils/tag';
import { FluxCapacitor } from 'groupby-api';
import * as riot from 'riot';
import { Sayt } from 'sayt';

export const META = Symbol('meta');
export const STYLISH = Symbol('stylish');

const sayt = new Sayt();

export interface FluxTag<T> extends riot.Tag.Instance {
  parent: FluxTag<any>;
  opts: T;

  flux: FluxCapacitor;
  services: Services;
  config: SearchandiserConfig;

  setDefaults(config: T): void;
}

export class FluxTag<T> {
  _tagName: string;
  _state: any;
  _aliases: any;

  init() {
    this._state = {};
    setTagName(this);
    inheritAliases(this);

    this.on('before-mount', () => configure(this));
    this.on('mount', () => setStylish(this));
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

  register(serviceName: string) {
    this.services[serviceName].register(this);
    this.on('unmount', () => this.services[serviceName].unregister(this));
  }

  // tslint:disable-next-line:max-line-length
  transform(alias: string, realias: string | string[], options: DependencyOptions = {}, transform: (obj: any) => any = (obj) => obj) {
    const dependency = { alias, realias, transform };
    this.on('before-mount', () => updateDependency(this, dependency, options));
    this.on('update', () => updateDependency(this, dependency, options));
  }

  inherits(alias: string, options?: DependencyOptions, transform: (obj: any) => any = (obj) => obj) {
    this.transform(alias, alias, options, transform);
  }

  _mixin(...mixins: any[]) {
    let meta;
    this.mixin(...mixins.map((mixin) => {
      meta = meta || mixin[META];
      return new mixin().__proto__;
    }));
    if (meta) {
      addMeta(this, meta, 'defaults', 'types', 'services');
    }
  }
}

export interface SaytTag<T> extends FluxTag<T> { }

export class SaytTag<T> {

  sayt: any;

  init() {
    this.sayt = sayt;
  }
}

export interface TagMeta {
  defaults?: any;
  types?: TypeMap;
  services?: string[];
}
export interface TypeMap { [key: string]: string; }
export interface ConfigureOptions {
  defaults?: any;
  services?: string[];
  types?: TypeMap;
}
export interface Dependency {
  alias: string;
  realias: string | string[];
  transform: (obj: any) => any;
}
export interface DependencyOptions {
  defaults?: any;
  types?: TypeMap;
}
