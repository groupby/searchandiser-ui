import * as debounce from 'debounce';
import { Navigation, SelectedRangeRefinement, SelectedValueRefinement } from 'groupby-api';
import * as oget from 'oget';
import * as queryString from 'query-string';
import filterObject = require('filter-object');

export type SelectedRefinement = SelectedValueRefinement & SelectedRangeRefinement;

export const LOCATION = {
  href: () => window.location.href,
  setSearch: (search) => window.location.search = search,
  getSearch: () => window.location.search,
  pathname: () => window.location.pathname,
  replace: (url) => window.location.replace(url),
  assign: (url) => window.location.assign(url)
};

export function findSearchBox() {
  return <HTMLInputElement>oget(findTag('gb-query'), '_tag.searchBox');
}

export function findTag(tagName: string): Element {
  return document.querySelector(tagName)
    || document.querySelector(`[data-is="${tagName}"]`)
    || document.querySelector(`[riot-tag="${tagName}"]`);
}

export function toRefinement(ref: SelectedRefinement, nav: Navigation) {
  return Object.assign({}, filterObject(ref, '{type,value,low,high}'), { navigationName: nav.name });
}

export function displayRefinement(ref: SelectedRefinement) {
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
  return queryString.parse(LOCATION.getSearch())[param] || null;
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
export function remap(x: any, mapping: any) {
  if (mapping) {
    return Object.keys(mapping).reduce((acc, key) => {
      const value = getPath(x, mapping[key]);
      if (value) {
        return Object.assign(acc, { [key]: value });
      } else {
        return acc;
      }
    }, {});
  } else {
    return x;
  }
}

export { debounce }

export function checkBooleanAttr(attribute: string, opts: any) {
  return typeof opts === 'object'
    && attribute in opts
    && opts[attribute] != 'false' // tslint:disable-line:triple-equals
    && opts[attribute] !== false;
}
