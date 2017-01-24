import { FluxTag, TypeMap } from '../tags/tag';
import * as debounce from 'debounce';
import { Navigation, RangeRefinement, ValueRefinement } from 'groupby-api';
import * as queryString from 'query-string';
import filterObject = require('filter-object');
import oget = require('oget');
import * as riot from 'riot';

export { debounce }

export type Refinement = ValueRefinement & RangeRefinement;

export const LOCATION = {
  href: () => window.location.href,
  setSearch: (search) => window.location.search = search,
  getSearch: () => window.location.search,
  pathname: () => window.location.pathname,
  replace: (url) => window.location.replace(url),
  assign: (url) => window.location.assign(url)
};

export const WINDOW = {
  addEventListener: (event, cb) => window.addEventListener(event, cb),
  Image: () => new Image()
};

export function findSearchBox() {
  return <HTMLInputElement>oget(findTag('gb-query'), '_tag.searchBox');
}

export function findTag(tagName: string) {
  return <riot.TagElement>(document.querySelector(tagName)
    || document.querySelector(`[data-is="${tagName}"]`));
}

export function toRefinement(ref: Refinement, nav: Navigation) {
  return Object.assign({}, filterObject(ref, '{type,value,low,high}'), { navigationName: nav.name });
}

export function displayRefinement(ref: Refinement) {
  return ref.type === 'Value' ? ref.value : `${ref.low} - ${ref.high}`;
}

export function checkNested(obj: any, ...keys: string[]): boolean {
  return Array.prototype.slice.call(arguments, 1)
    .reduce((res, arg) => {
      if (!obj || !obj.hasOwnProperty(arg)) return false;
      obj = obj[arg];
      return res;
    }, true);
}

export function getParam(param: string): string | null {
  return <string>queryString.parse(LOCATION.getSearch())[param] || null;
}

export function unless(obj: any, ...defaultObjs: any[]) {
  return obj !== undefined ? obj : unless(defaultObjs.splice(0, 1)[0], ...defaultObjs);
}

export function getPath(obj: any, path: string = '') {
  return oget(obj, path);
}

/**
 * Example:
 * ({x: 3, y: 4, h: 8}, {z: 'x', i: 'h'}) -> {z: 3, i: 8}
 *
 * N.B. It removes keys that do not appear in the mapping
 */
export function remap(obj: any, mapping?: any) {
  if (mapping) {
    return Object.keys(mapping).reduce((acc, key) => {
      const value = getPath(obj, mapping[key]);
      if (value) {
        return Object.assign(acc, { [key]: value });
      } else {
        return acc;
      }
    }, {});
  } else {
    return obj;
  }
}

export function checkBooleanAttr(attribute: string, opts: any, defaultValue: boolean = false) {
  if (typeof opts === 'object' && attribute in opts) {
    return opts[attribute] != 'false' && opts[attribute] !== false; // tslint:disable-line:triple-equals
  } else {
    return defaultValue;
  }
}

export function checkNumericAttr(attribute: string, opts: any, defaultValue?: number) {
  if (typeof opts === 'object' && attribute in opts) {
    return opts[attribute];
  } else {
    return defaultValue;
  }
}

export function scopeCss(tag: string, selector: string) {
  return `${tag} ${selector}, [data-is="${tag}"] ${selector}`;
}

export function collectServiceConfigs(tag: FluxTag<any>, services: string[]) {
  return services.reduce((configs, service) => {
    const config = oget(tag.services, `${service}._config`);
    if (config) {
      configs.push(config);
    }
    return configs;
  }, []);
}

export function coerceAttributes(opts: any, types: TypeMap) {
  return Object.keys(opts)
    .reduce((coerced, key) => {
      switch (types[key]) {
        case 'boolean':
          return Object.assign(coerced, { [key]: checkBooleanAttr(key, opts) });
        default:
          return Object.assign(coerced, { [key]: opts[key] });
      }
    }, {});
}
