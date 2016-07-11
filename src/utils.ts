export function toRefinement(ref, nav) {
  return Object.assign({}, pluck(ref, 'type', 'value', 'low', 'high'), { navigationName: nav.name });
}

export function pluck(obj: any, ...keys: string[]): any {
  return keys.reduce((res, key) => obj[key] ? Object.assign(res, { [key]: obj[key] }) : res, {});
}

export function getParam(param): string | null {
  const queryParam = window.location.search
    .substring(1)
    .split('&')
    .find(value => value.startsWith(param));
  return queryParam && queryParam.includes('=') ? queryParam.split('=')[1] : null;
}
