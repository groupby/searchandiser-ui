import oget = require('oget');
import {Query as ApiQuery} from 'groupby-api';
import queryString = require('query-string');

export function toRefinement(ref, nav) {
  return Object.assign({}, pluck(ref, 'type', 'value', 'low', 'high'), {navigationName: nav.name});
}

export function displayRefinement(ref) {
  return ref.type === 'Value' ? ref.value : `${ref.low} - ${ref.high}`;
}

export function pluck(obj:any, ...keys:string[]):any {
  return keys.reduce((res, key) => obj[key] ? Object.assign(res, {[key]: obj[key]}) : res, {});
}

export function checkNested(obj:any, ...keys:string[]):boolean {
  return Array.prototype.slice.call(arguments, 1)
    .reduce((res, arg) => {
      if (!obj || !obj.hasOwnProperty(arg)) return false;
      obj = obj[arg];
      return res;
    }, true);
}

export function getParam(param):string | null {
  return queryString.parse(window.location.search)[param] || null;
}

export const unless = (obj:any, defaultObj:any) => obj == undefined ? defaultObj : obj;

export const getPath = (obj:any, path:string) => oget(obj, path);

export const updateLocation = (searchUrl:string, queryParamName:string, query:string, refinements:Array<any>) => {
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
};

export const parseQueryFromLocation = (queryParamName:string, queryConfig:any) => {
  const queryParams = queryString.parse(location.search);

  let queryFromUrl = new ApiQuery(queryParams[queryParamName] || '').withConfiguration(queryConfig);

  if (queryParams.refinements) {
    const refinements = JSON.parse(queryParams.refinements);
    if (refinements.length > 0) {
      refinements.forEach((refinement) => queryFromUrl.withSelectedRefinements(refinement));
    }
  }

  return queryFromUrl;
};
