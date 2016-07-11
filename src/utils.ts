export function toRefinement(ref, nav) {
  return Object.assign({}, pluck(ref, 'type', 'value', 'low', 'high'), { navigationName: nav.name });
}

export function pluck(obj: any, ...keys: string[]): any {
  return keys.reduce((res, key) => obj[key] ? Object.assign(res, { [key]: obj[key] }) : res, {});
}

export function getParam(param): string | null {
  const queryParams = window.location.search
    .substring(1)
    .split('&');
  const index = queryParams.findIndex(value => value.indexOf(param) === 0);
  return index !== -1 && queryParams[index].includes('=') ? queryParams[index].split('=')[1] : null;
}
