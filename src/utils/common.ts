import * as clone from 'clone';
import * as debounce from 'debounce';
import * as GbTracker from 'gb-tracker-client';
import { Navigation, RangeRefinement, ValueRefinement } from 'groupby-api';
import * as Cookies from 'js-cookie';
import * as riot from 'riot';
import * as URL from 'url-parse';
import * as uuid from 'uuid';
import escapeStringRegexp = require('escape-string-regexp');
import filterObject = require('filter-object');
import * as dot from 'dot-prop';
import { FluxTag, TypeMap } from '../tags/tag';

export {
clone,
debounce,
escapeStringRegexp,
filterObject,
dot,
riot,
uuid,
Cookies,
GbTracker,
URL
};

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
  return <HTMLInputElement>dot.get(findTag('gb-query'), '_tag.searchBox');
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

export function refinementMatches(lhs: Refinement, rhs: Refinement): boolean {
  if (lhs.type === rhs.type) {
    if (lhs.type === 'Value') {
      return lhs.value === rhs.value;
    } else {
      return lhs.low === rhs.low && lhs.high === rhs.high;
    }
  } else {
    return false;
  }
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
  return <string>URL.qs.parse(LOCATION.getSearch())[param] || null;
}

export function unless(obj: any, ...defaultObjs: any[]) {
  return obj !== undefined ? obj : unless(defaultObjs.splice(0, 1)[0], ...defaultObjs);
}

export function getPath(obj: any, path: string = '') {
  return dot.get(obj, path);
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
    const config = dot.get(tag.services, `${service}._config`);
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
