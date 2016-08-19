import oget = require('oget');
import { Query } from 'groupby-api';
import { CONFIGURATION_MASK } from './searchandiser';
import queryString = require('query-string');
import filterObject = require('filter-object');

export function findSearchBox() {
  return <HTMLInputElement>oget(findTag('gb-query'), '_tag.searchBox');
}

export function findTag(tagName: string): Element {
  return document.querySelector(tagName)
    || document.querySelector(`[data-is="${tagName}"]`)
    || document.querySelector(`[riot-tag="${tagName}"]`);
}

export function toRefinement(ref, nav) {
  return Object.assign({}, filterObject(ref, '{type,value,low,high}'), { navigationName: nav.name });
}

export function displayRefinement(ref) {
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

export function getParam(param): string | null {
  return queryString.parse(window.location.search)[param] || null;
}

export function updateLocation(searchUrl: string, queryParamName: string, query: string, refinements: any[]) {
  const queryObj = {};

  if (refinements.length > 0) {
    queryObj['refinements'] = JSON.stringify(refinements)
  }

  queryObj[queryParamName] = query;

  if (window.location.pathname === searchUrl) {
    // Better way to do this is with browser history rewrites
    window.location.search = `?${queryString.stringify(queryObj)}`;
  } else {
    window.location.replace(`${searchUrl}?${queryString.stringify(queryObj)}`);
  }
}

export function parseQueryFromLocation(queryParamName: string, queryConfig: any) {
  const queryParams = queryString.parse(location.search);
  const queryFromUrl = new Query(queryParams[queryParamName] || '')
    .withConfiguration(queryConfig, CONFIGURATION_MASK);

  if (queryParams.refinements) {
    const refinements = JSON.parse(queryParams.refinements);
    if (refinements.length > 0) {
      refinements.forEach((refinement) => queryFromUrl.withSelectedRefinements(refinement));
    }
  }

  return queryFromUrl;
}

export function unless(obj: any, ...defaultObjs: any[]) {
  return obj !== undefined ? obj : unless(defaultObjs.splice(0, 1)[0], ...defaultObjs);
}

export function getPath(obj: any, path: string = '') {
  return oget(obj, path);
}

/*
Example:
({x: 3, y: 4, h: 8}, {z: 'x', i: 'h'}) -> {z: 3, i: 8}

N.B. It removes keys that do not appear in the mapping
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
