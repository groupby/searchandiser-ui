import { Services } from '../services/init';
import { configure, setAliases, setTagName } from '../utils/tag';
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
  // TODO: should get rid of this
  _style: string;

  init() {
    this._style = this.config.stylish ? 'gb-stylish' : '';
    setTagName(this);
    setAliases(this);

    this.on('before-mount', () => configure(this));
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
export interface TagConfigure {
  (opts: ConfigureOptions): void;
}
