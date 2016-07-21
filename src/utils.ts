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
  const queryParams = window.location.search
    .substring(1)
    .split('&');
  const index = queryParams.findIndex(value => value.indexOf(param) === 0);
  return index !== -1 && queryParams[index].includes('=') ? queryParams[index].split('=')[1] : null;
}

export const unless = (obj:any, defaultObj:any) => obj == undefined ? defaultObj : obj;

export function camelize(str) {
  return str.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
}
