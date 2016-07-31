import oget = require('oget');
import { Query } from 'groupby-api';
import queryString = require('query-string');

export function findTag(tagName: string): Element {
  return document.querySelector(`[riot-tag="${tagName}"]`);
}

export function toRefinement(ref, nav) {
  return Object.assign({}, pluck(ref, 'type', 'value', 'low', 'high'), { navigationName: nav.name });
}

export function displayRefinement(ref) {
  return ref.type === 'Value' ? ref.value : `${ref.low} - ${ref.high}`;
}

export function pluck(obj: any, ...keys: string[]): any {
  return keys.reduce((res, key) => obj[key] ? Object.assign(res, { [key]: obj[key] }) : res, {});
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
  const queryFromUrl = new Query(queryParams[queryParamName] || '').withConfiguration(queryConfig);

  if (queryParams.refinements) {
    const refinements = JSON.parse(queryParams.refinements);
    if (refinements.length > 0) {
      refinements.forEach((refinement) => queryFromUrl.withSelectedRefinements(refinement));
    }
  }

  return queryFromUrl;
}

export function unless(obj: any, defaultObj: any) {
  return obj === undefined ? defaultObj : obj;
}

export function getPath(obj: any, path: string) {
  return oget(obj, path);
}
