import { FluxCapacitor } from 'groupby-api';

export function mixinFlux(obj: any = {}): FluxCapacitor {
  const flux = new FluxCapacitor('');
  riot.mixin('test', Object.assign({}, { flux }, obj));
  return flux;
}

export function createTag(tag: string): HTMLElement {
  const html = document.createElement(tag)
  document.body.appendChild(html);
  return html;
}

export function removeTag(html: HTMLElement) {
  document.body.removeChild(html);
}
